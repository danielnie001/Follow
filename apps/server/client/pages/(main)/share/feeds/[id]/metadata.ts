import { defineMetadata } from "~/meta-handler"

export default defineMetadata(async ({ params, apiClient, origin, throwError }) => {
  const feedId = params.id

  const feed = await apiClient.feeds.$get({ query: { id: feedId } }).catch((e) => {
    throwError(e.response?.status || 500, "Feed not found")
    throw e
  })

  const { title, description } = feed.data.feed

  return [
    {
      type: "openGraph",
      title: title || "",
      description: description || "",
      image: `${origin}/og/feed/${feedId}`,
    },
    {
      type: "title",
      title: title || "",
    },
    {
      type: "hydrate",
      data: feed.data,
      path: apiClient.feeds.$url({ query: { id: feedId } }).pathname,
      key: `feeds.$get,query:id=${feedId}`,
    },
  ]
})