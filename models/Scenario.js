import mongoose from 'mongoose'

const Scenario_Schema = new mongoose.Schema({
  _id: Number,
  title: String,
  desc: String,
})

module.exports = mongoose.models.Scenario || mongoose.model('Scenario', Scenario_Schema)