import { FastifyInstance, RegisterOptions } from 'fastify'
import { prisma } from '../../utils'
import { NO_DATA_ANIME } from '../../utils/errors'

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const db = prisma.animeV2

  fastify.get('/anilist/:anilist_id', async (request, reply) => {
    const { anilist_id } = request.params as {
      anilist_id: string
    }

    const data = await db.findFirst({
      where: {
        anilist_id: anilist_id,
      },
    })

    if (!data) return NO_DATA_ANIME
    return { found: true, ...data }
  })

  fastify.get('/mal/:mal_id', async (request, reply) => {
    const { mal_id } = request.params as {
      mal_id: string
    }

    const data = await db.findFirst({
      where: {
        mal_id: mal_id,
      },
    })

    if (!data) return NO_DATA_ANIME
    return { found: true, ...data }
  })
}

export default routes
