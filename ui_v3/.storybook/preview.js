import { withDesign } from 'storybook-addon-designs'
export const parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/CyosX2UsPUoIbt48of5tIz/Data-Facade-V0?node-id=251%3A15466'
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

//export const decorators = [withDesign];

//export const decorators =  [withDesign, (Story) => <div style={{ background: 'red' }}><Story /></div>]