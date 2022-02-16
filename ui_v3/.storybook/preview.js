import { withDesign } from 'storybook-addon-designs'
export const parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/awGFKcU9U0XpnU4b500iT8/Early-Concepts?node-id=240%3A21'
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