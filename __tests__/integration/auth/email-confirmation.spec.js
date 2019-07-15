/**
 * @jest-environment node
 */
import supertest from 'supertest'
import server from '@server/app'
import User from '@models/User'
import { disconnect } from '../../utils/mongoose'

const app = () => supertest(server)

describe('The register process', () => {
  const EMAIL_CONFIRM_ENDPOINT = '/api/v1/auth/emails/confirm'
  const user = {
    name: 'Test User',
    email: 'test@user.com',
    password: 'password'
  }

  beforeAll(async () => {
    await User.deleteMany()
  })

  it('returns a 422 if token is invalid', async () => {
    const response = await app().post(EMAIL_CONFIRM_ENDPOINT).send({token: 'xxx'})

    expect(response.status).toBe(422)
    expect(response.body.message).toBe('Validation failed.')
  })

  it('confirm a user email', async () => {
    const createUser = await User.create(user)
    const response = await app().post(EMAIL_CONFIRM_ENDPOINT).send({token: createUser.emailConfirmCode})

    expect(response.status).toBe(200)
    expect(response.body.data.user.emailConfirmCode).toBeNull()
    expect(response.body.data.user.emailConfirmedAt).toBeDefined()
  })

  afterAll(async () => {
    await disconnect()
  })
})