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
      name: 'Syakasaba3',
    });

    const me = await room.join({ name: gamerTag });

    if(micDest.value) {
      const { stream } = micDest.value
      const selfStream = new LocalAudioStream(stream.getTracks()[0]);

      me.publish(selfStream, {
        maxSubscribers: 99
      });
    }

    const subscribeAttach = async (publication: RoomPublication) => {
      const audioContext = new AudioContext();

      const publisher = publication.publisher;
      const pubName = publisher.name!;

      if(publisher.id === me.id) return;

      const { stream, subscription } = await me.subscribe(publication.id);

      if(!(stream instanceof RemoteAudioStream)) return;

      const newStream = new MediaStream([stream.track])
      const source = audioContext.createMediaStreamSource(newStream);
      const gainNode = audioContext.createGain();

      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      gainNode.gain.value = 2;

      userList.value.push({
        name: pubName,
        gain: gainNode
      })

      console.log('subscribe at ' + pubName);
    }
    
    console.log(room.publications)
    room.publications.forEach(subscribeAttach);
    room.onStreamPublished.add(async (e) => subscribeAttach(e.publication));
  }
}
