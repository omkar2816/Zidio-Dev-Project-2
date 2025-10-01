import api from "../utils/axiosConfig"

const getBlogs = async (params) => {
  const response = await api.get("/blogs", { params })
  return response.data
}

const getBlog = async (id) => {
  const response = await api.get(`/blogs/${id}`)
  return response.data
}

const createBlog = async (blogData) => {
  const response = await api.post("/blogs", blogData)
  return response.data
}

const updateBlog = async (id, blogData) => {
  const response = await api.put(`/blogs/${id}`, blogData)
  return response.data
}

const deleteBlog = async (id) => {
  await api.delete(`/blogs/${id}`)
  return id
}

const likeBlog = async (id) => {
  const response = await api.post(`/blogs/${id}/like`)
  return response.data
}

const addComment = async (id, commentData) => {
  const response = await api.post(`/blogs/${id}/comments`, commentData)
  return response.data
}

const toggleBookmark = async (id) => {
  const response = await api.put(`/blogs/${id}/bookmark`)
  return response.data
}

const getBookmarkedBlogs = async () => {
  const response = await api.get("/blogs/bookmarks")
  return response.data
}

const blogService = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  toggleBookmark,
  getBookmarkedBlogs,
}

export default blogService
