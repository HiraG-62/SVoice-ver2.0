import type { RefSymbol } from "@vue/reactivity";

const createMicNode = () => {
  const {
    micLevel,
    media,
    micContext,
    micNode,
    micDest
  } = useComponents();

  const microphone = micContext.value!.createMediaStreamSource(media.value!);
  micNode.value = micContext.value!.createGain();
  micDest.value = micContext.value!.createMediaStreamDestination();

  micNode.value.gain.value = micLevel.value / 50;

  microphone.connect(micNode.value);
  micNode.value.connect(micDest.value);
}

export async function useAudio() {

  const {
    micLevel,
    media,
    micContext,
    micNode
  } = useComponents();


  try {
    media.value = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: {
        echoCancellation: false,
        noiseSuppression: true
      }
    });
    micContext.value = new AudioContext();

    createMicNode();
  } catch (err) {
    media.value = null;
    console.error('mic connection error: ', err);
  }

  watch(micLevel, (newVolume) => {
    if (micNode.value) {
      micNode.value.gain.value = newVolume / 50;
    }
  })
}

export function useMicIndicator() {

  const {
    micLevel,
    micIndicator,
    isMicTest,
    selectedInput,
    media,
    micContext,
    micNode
  } = useComponents();

  let analyser: AnalyserNode | null = null;
  let dataArray: Uint8Array | null = null;
  let animationFrameId: number | null = null;

  const startListening = async () => {
    if (micNode == null) {
      isMicTest.value = false;
      console.warn('not connecting microphone')
      return;
    }
    try {
      analyser = micContext.value!.createAnalyser();
      micNode.value?.connect(analyser);
      micNode.value?.connect(micContext.value!.destination);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        analyser?.getByteFrequencyData(dataArray!);
        const sum = dataArray?.reduce((acc, val) => acc + val, 0) || 0;
        micIndicator.value = Math.min(Math.max(sum / bufferLength, 0), 100);
        animationFrameId = requestAnimationFrame(updateVolume);
        console.log(micIndicator.value)
      };

      updateVolume();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  }

  const stopListening = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (micContext.value) {
      analyser = null;
      try {
        micNode.value?.disconnect(micContext.value.destination);
      } catch { };
    }
    micIndicator.value = 0;
  };

  watch(media, async (newMedia) => {
    if (analyser != null) {
      stopListening();
      await startListening();
    }
  });

  onUnmounted(() => {
    stopListening();
  });

  return { startListening, stopListening };
}

export async function useAudioDevice() {
  const {
    audioInputs,
    audioOutputs,
    selectedInput,
    selectedOutput,
    media
  } = useComponents();

  const audioTrack = media.value?.getAudioTracks()[0];

  const devices = await navigator.mediaDevices.enumerateDevices();
  audioInputs.value = devices
    .filter(device =>
      device.kind === 'audioinput' &&
      device.deviceId !== 'default' &&
      device.deviceId !== 'communications'
    )
    .map(device => ({
      ...device,
      label: device.label || 'Unknown Microphone',
      deviceId: device.deviceId || 'Unknown Microphone'
    }) as AudioDevice);

  audioOutputs.value = devices
    .filter(device =>
      device.kind === 'audiooutput'
    )
    .map(device => ({
      ...device,
      label: device.label || 'Unknown Speaker',
      deviceId: device.deviceId || 'Unknown Speaker'
    }) as AudioDevice);

  selectedInput.value = audioInputs.value
    .find(device => device.deviceId === audioTrack?.getSettings().deviceId) as AudioDevice;

  selectedOutput.value = audioOutputs.value
    .find(device => device.deviceId === 'default') as AudioDevice;
}

export async function useChangeMicMedia() {
  const {
    micLevel,
    selectedInput,
    media,
    micContext,
    micNode,
    micDest
  } = useComponents();

  const stopStream = () => {
    if (media.value) {
      media.value.getTracks().forEach(track => track.stop());
      media.value = null;
    }
  }

  try {
    stopStream();

    const newMedia = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: {
        echoCancellation: false,
        noiseSuppression: true,
        deviceId: selectedInput.value?.deviceId
      }
    });

    media.value = newMedia;

    createMicNode();
  } catch (error) {
    console.error('Error changing microphone:', error);
  }
}