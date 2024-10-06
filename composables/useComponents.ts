export function useComponents() {
  const themeColor = useState<string>('themeColor', () => 'teal');
  const themeColorLight = (num: number) => useState<string>('themeColorLight', () => `${themeColor.value}-lighten-${num}`);
  const themeColorDark = (num: number) => useState<string>('themeColorDark', () => `${themeColor.value}-darken-${num}`);

  const gamerTag = useState<string>('gamerTag', () => 'test');

  const micIndicator = useState<number>('micIndicator', () => 0);
  const micIndicatorMax = ref<number>(50);
  const micIndicatorMin = ref<number>(0);

  const isMicTest = ref<boolean>(false);
  const isSelfMute = useState<boolean>('isSelfMute', () => false);
  const isExtendsMic = ref<boolean>(false);
  const isJoining = useState<boolean>('isJoining', () => false)

  const phoneSlider = useState<number>('phoneSlider', () => 100);
  const phoneMax = ref<number>(200);
  const phoneMin = ref<number>(0);

  const micSlider = useState<number>('micSlider', () => 100);
  const micMax = ref<number>(200);
  const micMin = ref<number>(0);

  const micIndicatorColor = computed(() => sliderLevel(micIndicator.value, micIndicatorMax.value));
  const micLevelColor = computed(() => sliderLevel(micSlider.value, micMax.value));

  const audioInputs = useState<MediaDeviceInfo[]>('audioInputs', () => []);
  const audioOutputs = useState<MediaDeviceInfo[]>('audioOutputs', () => []);

  const selectedInput = useState<AudioDevice | null>('selectedInput', () => null);
  const selectedOutput = useState<AudioDevice | null>('selectedOutput', () => null);

  const media = useState<MediaStream | null>('media', () => null);
  const micContext = useState<AudioContext | null>('micContext', () => null);
  const micNode = useState<GainNode | null>('micNode', () => null);
  const micDest = useState<MediaStreamAudioDestinationNode | null>('micDest', () => null);

  function sliderLevel(value: number, max: number) {
    if (value == 0) return 'grey'
    else if (value < max * 0.2) return 'indigo'
    else if (value < max * 0.4) return 'teal'
    else if (value < max * 0.6) return 'green'
    else if (value < max * 0.8) return 'orange'
    return 'red'
  }

  return {
    themeColor,
    themeColorLight,
    themeColorDark,
    gamerTag,
    micIndicator,
    micIndicatorMax,
    micIndicatorMin,
    isMicTest,
    isSelfMute,
    isExtendsMic,
    isJoining,
    phoneSlider,
    phoneMax,
    phoneMin,
    micSlider,
    micMax,
    micMin,
    micIndicatorColor,
    micLevelColor,
    audioInputs,
    audioOutputs,
    selectedInput,
    selectedOutput,
    media,
    micContext,
    micNode,
    micDest
  }
}