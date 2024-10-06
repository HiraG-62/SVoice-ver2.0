import { nowInSec, SkyWayAuthToken, SkyWayContext, SkyWayRoom, uuidV4, LocalAudioStream } from '@skyway-sdk/room'

export async function useConnectSkyway(gamerTag: string) {
  if (!import.meta.env.SSR) {
    const {
      nowInSec,
      SkyWayAuthToken,
      SkyWayContext,
      SkyWayRoom,
      uuidV4,
      LocalAudioStream
    } = await import('@skyway-sdk/room');

    const {
      media,
      micNode,
      micDest
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

    if(micDest.value) {
      const { stream } = micDest.value
      const selfStream = new LocalAudioStream(stream.getTracks()[0]);

      me.publish(selfStream, {
        maxSubscribers: 99
      });
    }

  }
}
