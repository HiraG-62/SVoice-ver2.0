import type { RoomPublication } from '@skyway-sdk/room';

export async function useConnectSkyway(gamerTag: string) {
  if (typeof window !== 'undefined' && !import.meta.env.SSR) {
    const {
      nowInSec,
      SkyWayAuthToken,
      SkyWayContext,
      SkyWayRoom,
      uuidV4,
      LocalAudioStream,
      RemoteAudioStream
    } = await import('@skyway-sdk/room');

    const {
      media,
      audioContext,
      micNode,
      micDest,
      userList
    } = useComponents();

    const config = useRuntimeConfig();
    const appId = config.public.skywayAppId as string;
    const secretKey = config.public.skywaySecretKey as string;


    const token = new SkyWayAuthToken({
      jti: uuidV4(),
      iat: nowInSec(),
      exp: nowInSec() + 60 * 60 * 24,
      scope: {
        app: {
          id: appId,
          turn: true,
          actions: ['read'],
          channels: [
            {
              id: '*',
              name: '*',
              actions: ['write'],
              members: [
                {
                  id: '*',
                  name: '*',
                  actions: ['write'],
                  publication: {
                    actions: ['write'],
                  },
                  subscription: {
                    actions: ['write'],
                  },
                },
              ],

              sfuBots: [
                {
                  actions: ['write'],
                  forwardings: [
                    {
                      actions: ['write'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    }).encode(secretKey);

    const context = await SkyWayContext.Create(token);
    const room = await SkyWayRoom.FindOrCreate(context, {
      type: 'sfu',
      name: 'test',
    });

    const me = await room.join({ name: gamerTag });

    if (micDest.value) {
      const { stream } = micDest.value
      const selfStream = new LocalAudioStream(stream.getTracks()[0]);

      await me.publish(selfStream, {
        maxSubscribers: 99
      });
    }

    const subscribeAttach = async (publication: RoomPublication) => {

      const publisher = publication.publisher;
      const pubName = publisher.name!;

      if (publisher.id === me.id) return;

      const { stream, subscription } = await me.subscribe(publication.id);

      if (!(stream instanceof RemoteAudioStream)) return;

      const newStream = new MediaStream([stream.track]);

      const tempAudio = new Audio();
      tempAudio.controls = true;
      tempAudio.autoplay = true;
      tempAudio.muted = true;
      tempAudio.srcObject = newStream;

      const source = audioContext.value!.createMediaStreamSource(newStream);
      const gainNode = audioContext.value!.createGain();
      const destination = audioContext.value!.createMediaStreamDestination();
      const analyser = audioContext.value!.createAnalyser();
      let animationFrameId: number;
      analyser.fftSize = 256;

      const isVoiceDetected = ref<boolean>(false);

      const checkAudioLevel = async () => {
        if (analyser) {
          const bufferLength = analyser.fftSize;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteTimeDomainData(dataArray);

          // 振幅が変化しているかをチェック
          const isDetected = dataArray.some(value => Math.abs(value - 128) > 1 ); // 128は無音状態
          isVoiceDetected.value = isDetected;

          await new Promise((resolve) => setTimeout(resolve, 200));

          checkAudioLevel();
        }
      }

      source.connect(gainNode);
      gainNode.connect(destination);
      gainNode.connect(analyser);

      checkAudioLevel();

      const newAudio = new Audio();
      newAudio.controls = true;
      newAudio.autoplay = true;
      newAudio.muted = false;
      newAudio.srcObject = destination.stream;

      const userInfo = reactive({
        gamerTag: pubName,
        gain: ref(1),
        voice: isVoiceDetected
      })
      userList.value.push(userInfo)


      const test = ref<number>(1)
      // useGetDataSocket(test)

      const changeGain = computed(() => {
        return 2 * userInfo.gain;
      })

      gainNode.gain.value = changeGain.value

      watch(changeGain, (newInfo) => {
        gainNode.gain.value = changeGain.value
      })

    }

    console.log(room.publications)
    room.publications.forEach(subscribeAttach);
    room.onStreamPublished.add(async (e) => subscribeAttach(e.publication));
  }
}
