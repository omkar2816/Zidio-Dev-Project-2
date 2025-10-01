import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import blogService from "../../services/blogService"

const initialState = {
  blogs: [],
  blog: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
}

export const getBlogs = createAsyncThunk("blog/getAll", async (params, thunkAPI) => {
  try {
    return await blogService.getBlogs(params)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

export const getBlog = createAsyncThunk("blog/get", async (id, thunkAPI) => {
  try {
    return await blogService.getBlog(id)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

export const createBlog = createAsyncThunk("blog/create", async (blogData, thunkAPI) => {
  try {
    return await blogService.createBlog(blogData)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

export const updateBlog = createAsyncThunk("blog/update", async ({ id, blogData }, thunkAPI) => {
  try {
    return await blogService.updateBlog(id, blogData)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

export const deleteBlog = createAsyncThunk("blog/delete", async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await blogService.deleteBlog(id, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ""
    },
    updateBlogLikes: (state, action) => {
      const { blogId, likes } = action.payload
      
      // Update in blogs array
      const blogIndex = state.blogs.findIndex(blog => blog._id === blogId)
      if (blogIndex !== -1) {
        state.blogs[blogIndex].likes = likes
      }
      
      // Update current blog if it matches
      if (state.blog && state.blog._id === blogId) {
        state.blog.likes = likes
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBlogs.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.blogs = action.payload
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getBlog.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getBlog.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.blog = action.payload
      })
      .addCase(getBlog.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.blogs.push(action.payload)
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload)
      })
  },
})

export const { reset, updateBlogLikes } = blogSlice.actions
export default blogSlice.reducer
