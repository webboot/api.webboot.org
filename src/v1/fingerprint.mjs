import { fingerprint as body } from '@webboot/keys'

export const fingerprint = async (req, res) => ({
  code: 200,
  headers: { 'Content-Type': 'text/plain' },
  body,
})
