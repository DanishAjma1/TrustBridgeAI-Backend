import mongoose from "mongoose"

const UserSchema  = mongoose.Schema({
    name: String,
    email: String,
    password:String,
    role: String,
    avatarUrl: String,
    bio: String,
    startupName: String,
    pitchSummary: String,
    fundingNeeded: String,
    industry: String,
    location: String,
    foundedYear: Number,
    teamSize: Number,
    isOnline: Boolean,
});

const User = mongoose.model("User",UserSchema);
export default User;
    