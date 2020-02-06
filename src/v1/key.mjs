import { armored as body } from '@webboot/keys'

export const key = async (req, res) => ({
  code: 200,
  headers: { 'Content-Type': 'text/plain' },
  body,
})
