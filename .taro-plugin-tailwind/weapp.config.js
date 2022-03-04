const range = (size) =>
    Object.fromEntries(
        [...Array(size).keys()]
            .slice(1)
            .map((i) => [`${i}_${size}`, `${(i / size) * 100}%`])
    );
    const generateSpacing = (num) => {
      return new Array(num).fill(1).reduce(
        (cur, next, index) => ({ ...cur, [index]: `${index * 2 }rpx`}),
        {}
      );
    };
    module.exports = {
      prefixer: false,
      separator: "_",
      compile: false,
      globalUtility: false,
      darkMode: "media",
      important: true,
      corePlugins: {
        space: false,
        divideStyle: false,
        divideWidth: false,
        divideColor: false,
        divideOpacity: false,
        // 涉及到通配符（*），wx 小程序不支持
        ringWidth: false,
        ringColor: false,
        ringOpacity: false,
        ringOffsetWidth: false,
        ringOffsetColor: false,
        // web 浏览器相关功能，wx 小程序不支持
        appearance: false,
        cursor: false,
        outline: false,
        placeholderColor: false,
        pointerEvents: false,
        stroke: false,
        tableLayout: false,
        userSelect: false,
      },
      theme: {
        extend: {
          colors: {
            green: {
              theme: "#27AE60",
            },
            blue: {
              theme: "#2F80ED",
            },
            gray: {
              "desc-50": "#E0E0E0",
              "desc-100": "#BDBDBD",
              "desc-200": "#828282",
            },
          },
        },
        spacing: {
          ...generateSpacing(201),
        },
        fontSize: (theme) => theme("spacing"),
        borderWidth: (theme) => theme("spacing"),
        lineHeight: (theme) => theme("spacing"),
        translate: (theme) => theme("spacing"),
        inset: (theme) => theme("spacing"),
        borderRadius: (theme) => theme("spacing"),
        width: (theme) => ({
          auto: "auto",
          full: "100%",
          screen: "100vw",
          ...Object.assign(...[2, 3, 4, 5, 6, 12].map(range)),
          ...theme("spacing"),
        }),
        height: (theme) => ({
          auto: "auto",
          full: "100%",
          screen: "100vh",
          ...Object.assign(...[2, 3, 4, 5, 6, 12].map(range)),
          ...theme("spacing"),
        }),
        maxHeight: {
          full: "100%",
          screen: "100vh",
        },
      },
    };
