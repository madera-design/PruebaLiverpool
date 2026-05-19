const DYNAMIC_FORM_URL =
  'https://mocki.io/v1/a43638ef-f5d8-462c-affa-5beaf7f4c208'

export async function fetchDynamicFormConfig() {
  const response = await fetch(DYNAMIC_FORM_URL)

  if (!response.ok) {
    throw new Error('No pudimos cargar la configuracion del formulario.')
  }

  return response.json()
}
