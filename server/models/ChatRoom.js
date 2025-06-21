const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    members: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
      role: {
        type: String,
        enum: ["admin", "moderator", "member"],
        default: "member",
      },
    }],
    isPrivate: {
      type: Boolean,
      default: false, // false = public room, true = private/invite-only
    },
    maxMembers: {
      type: Number,
      default: 100,
      min: 2,
      max: 500,
    },
    avatar: {
      type: String,
      default: null,
    },
    settings: {
      allowFileSharing: {
        type: Boolean,
        default: true,
      },
      allowMemberInvites: {
        type: Boolean,
        default: true,
      },
      muteNotifications: {
        type: Boolean,
        default: false,
      },
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    messageCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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
chatRoomSchema.index({ isPrivate: 1, isActive: 1 });
chatRoomSchema.index({ lastActivity: -1 });

// Virtual for member count
chatRoomSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Ensure virtual fields are serialized
chatRoomSchema.set('toJSON', { virtuals: true });
chatRoomSchema.set('toObject', { virtuals: true });

// Method to check if user is member
chatRoomSchema.methods.isMember = function(userId) {
  return this.members.some(member => member.user.toString() === userId.toString());
};

// Method to check if user is admin
chatRoomSchema.methods.isAdmin = function(userId) {
  return this.admin.toString() === userId.toString();
};

// Method to check if user is moderator or admin
chatRoomSchema.methods.canModerate = function(userId) {
  if (this.isAdmin(userId)) return true;
  const member = this.members.find(member => member.user.toString() === userId.toString());
  return member && (member.role === 'moderator' || member.role === 'admin');
};

// Method to add member
chatRoomSchema.methods.addMember = function(userId, role = 'member') {
  if (!this.isMember(userId) && this.members.length < this.maxMembers) {
    this.members.push({
      user: userId,
      role: role,
      joinedAt: new Date(),
    });
    return true;
  }
  return false;
};

// Method to remove member
chatRoomSchema.methods.removeMember = function(userId) {
  const memberIndex = this.members.findIndex(member => member.user.toString() === userId.toString());
  if (memberIndex > -1) {
    this.members.splice(memberIndex, 1);
    return true;
  }
  return false;
};

// Pre-save middleware to update lastActivity
chatRoomSchema.pre('save', function(next) {
  if (this.isModified('members') || this.isModified('messageCount')) {
    this.lastActivity = new Date();
  }
  next();
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = ChatRoom;
