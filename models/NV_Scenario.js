import mongoose from 'mongoose'

const NV_Scenario_Schema = new mongoose.Schema({
  title: String,
  desc: String,
  username: String
})

module.exports = mongoose.models.NV_Scenario || mongoose.model('NV_Scenario', NV_Scenario_Schema)