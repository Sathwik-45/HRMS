const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "moderator", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        lastSeen: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    maxMembers: {
      type: Number,
      default: 100,
      min: 2,
      max: 1000,
    },
    messageCount: {
      type: Number,
      default: 0,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 30,
      },
    ],
    avatar: {
      type: String,
      default: null,
    },
    settings: {
      allowFileSharing: {
        type: Boolean,
        default: true,
      },
      allowImageSharing: {
        type: Boolean,
        default: true,
      },
      moderationEnabled: {
        type: Boolean,
        default: false,
      },
      autoDeleteMessages: {
        type: Boolean,
        default: false,
      },
      autoDeleteDays: {
        type: Number,
        default: 30,
        min: 1,
        max: 365,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
chatRoomSchema.index({ name: 1 });
chatRoomSchema.index({ admin: 1 });
chatRoomSchema.index({ "members.user": 1 });
chatRoomSchema.index({ isActive: 1, isPrivate: 1 });
chatRoomSchema.index({ lastActivity: -1 });

// Virtual for member count
chatRoomSchema.virtual("memberCount").get(function () {
  return this.members.length;
});

// Virtual for formatted creation date
chatRoomSchema.virtual("formattedCreatedAt").get(function () {
  return this.createdAt.toLocaleDateString();
});

// Virtual for formatted last activity
chatRoomSchema.virtual("formattedLastActivity").get(function () {
  return this.lastActivity.toLocaleDateString();
});

// Method to check if user is a member
chatRoomSchema.methods.isMember = function (userId) {
  return this.members.some(member => member.user.toString() === userId.toString());
};

// Method to check if user is admin
chatRoomSchema.methods.isAdmin = function (userId) {
  return this.admin.toString() === userId.toString();
};

// Method to check if user is moderator or admin
chatRoomSchema.methods.isModerator = function (userId) {
  if (this.isAdmin(userId)) return true;
  return this.members.some(
    member => member.user.toString() === userId.toString() && member.role === "moderator"
  );
};

// Method to add a member
chatRoomSchema.methods.addMember = function (userId, role = "member") {
  if (this.isMember(userId)) return false;
  if (this.members.length >= this.maxMembers) return false;

  this.members.push({
    user: userId,
    role: role,
    joinedAt: new Date(),
    lastSeen: new Date(),
  });

  return true;
};

// Method to remove a member
chatRoomSchema.methods.removeMember = function (userId) {
  const memberIndex = this.members.findIndex(
    member => member.user.toString() === userId.toString()
  );

  if (memberIndex === -1) return false;

  this.members.splice(memberIndex, 1);
  return true;
};

// Method to update member role
chatRoomSchema.methods.updateMemberRole = function (userId, newRole) {
  const member = this.members.find(
    member => member.user.toString() === userId.toString()
  );

  if (!member) return false;

  member.role = newRole;
  return true;
};

// Method to update member last seen
chatRoomSchema.methods.updateMemberLastSeen = function (userId) {
  const member = this.members.find(
    member => member.user.toString() === userId.toString()
  );

  if (!member) return false;

  member.lastSeen = new Date();
  return true;
};

// Static method to get public rooms
chatRoomSchema.statics.getPublicRooms = function (limit = 20) {
  return this.find({ isPrivate: false, isActive: true })
    .populate("admin", "name email image")
    .populate("members.user", "name email image isOnline")
    .sort({ lastActivity: -1 })
    .limit(limit);
};

// Static method to get user's rooms
chatRoomSchema.statics.getUserRooms = function (userId, limit = 20) {
  return this.find({
    isActive: true,
    "members.user": userId,
  })
    .populate("admin", "name email image")
    .populate("members.user", "name email image isOnline")
    .sort({ lastActivity: -1 })
    .limit(limit);
};

// Pre-save middleware to update lastActivity
chatRoomSchema.pre("save", function (next) {
  if (this.isModified("messageCount")) {
    this.lastActivity = new Date();
  }
  next();
});

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
