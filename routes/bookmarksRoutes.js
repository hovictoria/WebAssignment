const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const Event = require('../models/Event');

// ============================================================================
// MIDDLEWARE: Check if user is logged in
// ============================================================================
const checkAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ 
      success: false,
      error: 'Please log in first' 
    });
  }
  next();
};

// ============================================================================
// MIDDLEWARE: Check if user owns the bookmark
// ============================================================================
const checkBookmarkOwnership = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOne({ bookmarkId: req.params.bookmarkId });
    
    if (!bookmark) {
      return res.status(404).json({ 
        success: false,
        error: 'Bookmark not found' 
      });
    }
    
    if (bookmark.userId !== req.session.userId) {
      return res.status(403).json({ 
        success: false,
        error: 'You can only manage your own bookmarks' 
      });
    }
    
    req.bookmark = bookmark;
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error: ' + error.message 
    });
  }
};

// ============================================================================
// CREATE: POST /api/bookmarks/add
// This adds a new bookmark to the database
// ============================================================================
router.post('/bookmarks/add', checkAuth, async (req, res) => {
  try {
    const { eventId, notes } = req.body;
    
    // Validation: eventId is required
    if (!eventId) {
      return res.status(400).json({ 
        success: false,
        error: 'Event ID is required' 
      });
    }
    
    // Validation: eventId must be a string
    if (typeof eventId !== 'string') {
      return res.status(400).json({ 
        success: false,
        error: 'Event ID must be a string' 
      });
    }
    
    // Validation: Event must exist
    const eventExists = await Event.findOne({ eventId });
    if (!eventExists) {
      return res.status(404).json({ 
        success: false,
        error: 'Event not found' 
      });
    }
    
    // Validation: Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({
      userId: req.session.userId,
      eventId: eventId
    });
    
    if (existingBookmark) {
      return res.status(400).json({ 
        success: false,
        error: 'You have already bookmarked this event' 
      });
    }
    
    // Validation: Notes length check
    if (notes && notes.length > 500) {
      return res.status(400).json({ 
        success: false,
        error: 'Notes cannot exceed 500 characters' 
      });
    }
    
    // Create the bookmark
    const newBookmark = new Bookmark({
      userId: req.session.userId,
      eventId: eventId,
      notes: notes || ''
    });
    
    // Save to database
    await newBookmark.save();
    
    // Return success
    res.status(201).json({
      success: true,
      message: 'Event bookmarked successfully',
      bookmark: newBookmark
    });
    
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to bookmark event: ' + error.message 
    });
  }
});

// ============================================================================
// READ: GET /api/bookmarks
// This gets all bookmarks for the logged-in user
// ============================================================================
router.get('/bookmarks', checkAuth, async (req, res) => {
  try {
    // Get all bookmarks for this user
    const bookmarks = await Bookmark.find({ userId: req.session.userId })
      .sort({ savedAt: -1 }); // Most recent first
    
    if (bookmarks.length === 0) {
      return res.json({
        success: true,
        message: 'No bookmarks found',
        count: 0,
        bookmarks: []
      });
    }
    
    // Get event details for each bookmark (retrieval from 2 schemas)
    const bookmarksWithDetails = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const event = await Event.findOne({ eventId: bookmark.eventId });
        return {
          bookmarkId: bookmark.bookmarkId,
          eventId: bookmark.eventId,
          savedAt: bookmark.savedAt,
          notes: bookmark.notes,
          eventDetails: event
        };
      })
    );
    
    res.json({
      success: true,
      message: 'Bookmarks retrieved successfully',
      count: bookmarks.length,
      bookmarks: bookmarksWithDetails
    });
    
  } catch (error) {
    console.error('Error retrieving bookmarks:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve bookmarks: ' + error.message 
    });
  }
});

// ============================================================================
// READ: GET /api/bookmarks/check/:eventId
// This checks if a specific event is bookmarked
// ============================================================================
router.get('/bookmarks/check/:eventId', checkAuth, async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const bookmark = await Bookmark.findOne({
      userId: req.session.userId,
      eventId: eventId
    });
    
    res.json({
      success: true,
      isBookmarked: !!bookmark,
      bookmarkId: bookmark ? bookmark.bookmarkId : null
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to check bookmark: ' + error.message 
    });
  }
});

// ============================================================================
// UPDATE: PUT /api/bookmarks/:bookmarkId
// This updates the notes on a bookmark
// ============================================================================
router.put('/bookmarks/:bookmarkId', checkAuth, checkBookmarkOwnership, async (req, res) => {
  try {
    const { notes } = req.body;
    
    // Validation: notes length
    if (notes && notes.length > 500) {
      return res.status(400).json({ 
        success: false,
        error: 'Notes cannot exceed 500 characters' 
      });
    }
    
    // Update the bookmark
    const updatedBookmark = await Bookmark.findOneAndUpdate(
      { bookmarkId: req.params.bookmarkId },
      { notes: notes || '' },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Bookmark updated successfully',
      bookmark: updatedBookmark
    });
    
  } catch (error) {
    console.error('Error updating bookmark:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update bookmark: ' + error.message 
    });
  }
});

// ============================================================================
// DELETE: DELETE /api/bookmarks/:bookmarkId
// This removes a bookmark
// ============================================================================
router.delete('/bookmarks/:bookmarkId', checkAuth, checkBookmarkOwnership, async (req, res) => {
  try {
    const result = await Bookmark.findOneAndDelete({ 
      bookmarkId: req.params.bookmarkId 
    });
    
    if (!result) {
      return res.status(404).json({ 
        success: false,
        error: 'Bookmark not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Bookmark removed successfully'
    });
    
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete bookmark: ' + error.message 
    });
  }
});

module.exports = router;