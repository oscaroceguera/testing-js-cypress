/**
 * @jest-environment node
 */
import supertest from 'supertest'
import server from '@server/app'
import User from '@models/User'
import { disconnect } from '../../utils/mongoose'

const app = () => supertest(server)

describe('The register process', () => {
  const REGISTER_ENDPOINT = '/api/v1/auth/register'
  const user = {
    name: 'Test User',
    email: 'test@user.com',
    password: 'password'
  }

  beforeAll(async () => {
    await User.deleteMany()
  })

  it('should register a new user', async () => {
    const response = await app().post(REGISTER_ENDPOINT).send(user)

    expect(response.status).toBe(200)
    expect(response.body.data.token).toBeDefined()
    expect(response.body.message).toBe('Account registered.')
  })

 it('should return a 422 if registration fails', async () => {
        // prepare
        await User.create(user)

        // action
        const response = await app().post(REGISTER_ENDPOINT).send(user)

        // assertion
        expect(response.status).toBe(422)
        expect(response.body.message).toBe('Validation failed.')
        expect(response.body.data.errors).toEqual({
            email: 'This email has already been taken.'
        })
    })


  afterAll(async () => {
    await disconnect()
  })
})