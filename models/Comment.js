import mongoose from 'mongoose'

const Comment_Schema = new mongoose.Schema({
  post: Number,
  username: String,
  body: String
})

module.exports = mongoose.models.Comment || mongoose.model('Comment', Comment_Schema)
