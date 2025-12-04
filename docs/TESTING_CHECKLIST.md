# Mentoring Feature Testing Checklist

## Phase 8: Testing & Verification

### Manual Testing Checklist

#### Authentication & Authorization
- [ ] Unauthenticated users are redirected to signin page
- [ ] Only session participants can access session pages
- [ ] Pusher channel authentication verifies session membership
- [ ] API routes check authentication via NextAuth
- [ ] Users cannot access other users' sessions

#### Profile Management
- [ ] User can enable/disable mentoring profile
- [ ] User can add and remove expertise tags (1-10 items)
- [ ] User can add and remove languages (1+ items)
- [ ] Bio validation works (10-500 characters)
- [ ] Video intro URL validation accepts valid URLs only
- [ ] Hourly rate accepts positive numbers
- [ ] Profile changes persist to database
- [ ] Profile view page displays all mentoring information correctly

#### Mentor Discovery
- [ ] Discovery page shows only enabled mentors
- [ ] User is excluded from their own search results
- [ ] Expertise filter works correctly
- [ ] Language filter works correctly
- [ ] Free-only filter works correctly
- [ ] Mentor cards display all information (bio, expertise, languages, rate)
- [ ] "Book Session" button navigates with mentor email parameter

#### Session Booking
- [ ] Calendar displays correctly with react-day-picker
- [ ] Past dates are disabled
- [ ] Time slots display (9 AM - 5 PM in 30-min intervals)
- [ ] Selected time highlights correctly
- [ ] Duration selection works (15, 30, 60, 90, 120 minutes)
- [ ] Topic validation works (5-200 characters)
- [ ] Session creation succeeds with valid data
- [ ] Unique session ID is generated
- [ ] Session appears in "My Sessions" after booking
- [ ] Form validation prevents invalid submissions

#### Sessions Dashboard
- [ ] Upcoming sessions display correctly
- [ ] Past sessions display correctly
- [ ] Sessions show correct role (mentor/mentee)
- [ ] Session status badges display correctly
- [ ] "Join Session" button appears for scheduled sessions
- [ ] "Cancel" button works and prompts for reason
- [ ] Cancelled sessions show cancellation details
- [ ] Session notes display in past sessions
- [ ] Empty state shows when no sessions exist

#### WebRTC Video Sessions
- [ ] Browser prompts for camera/microphone permissions
- [ ] Local video stream displays in corner
- [ ] Remote video stream displays in main area
- [ ] Mentor creates offer and sends via Pusher
- [ ] Mentee receives offer and sends answer
- [ ] ICE candidates exchange correctly
- [ ] Connection establishes between peers
- [ ] "Connecting..." indicator shows during setup
- [ ] Connection indicator updates when established
- [ ] Video quality is acceptable
- [ ] Audio quality is acceptable

#### Video Controls
- [ ] Mute button toggles audio on/off
- [ ] Video button toggles camera on/off
- [ ] End Call button terminates session and redirects
- [ ] Button states reflect current status (muted/unmuted)
- [ ] Local video preview reflects camera state

#### Real-time Chat
- [ ] Chat messages send via presence channel
- [ ] Messages appear in real-time for both participants
- [ ] Messages display sender email correctly
- [ ] Own messages align right with blue background
- [ ] Other messages align left with gray background
- [ ] Chat auto-scrolls to latest message
- [ ] Enter key sends message
- [ ] Empty messages are not sent

#### Session Notes
- [ ] Notes textarea displays initial notes from database
- [ ] Notes auto-save after 1 second of inactivity (debounce)
- [ ] "Saving..." indicator shows during save
- [ ] Notes persist between page refreshes
- [ ] Both participants can edit notes
- [ ] Notes updates don't conflict

### Security Verification Checklist

#### Authentication Security
- [ ] All mentoring routes require authentication
- [ ] Session tokens are validated on every request
- [ ] Expired sessions redirect to signin
- [ ] No authentication bypasses exist

#### Authorization Security
- [ ] Session access restricted to mentor/mentee only
- [ ] Pusher channel auth validates session membership
- [ ] API routes verify user is session participant
- [ ] Users cannot forge session access
- [ ] Channel naming is secure and validated

#### Input Validation
- [ ] All form inputs validated with Zod schemas
- [ ] API endpoints reject invalid data
- [ ] SQL/NoSQL injection prevented
- [ ] XSS attacks prevented
- [ ] File upload validation (if applicable)

#### Data Privacy
- [ ] Personal identifiers minimized in Pusher payloads
- [ ] Session data not exposed in URLs beyond session ID
- [ ] User emails not exposed unnecessarily
- [ ] Sensitive data encrypted in transit (HTTPS)
- [ ] Database queries use parameterized queries

#### Rate Limiting (Future Enhancement)
- [ ] Session creation rate limited (prevent spam bookings)
- [ ] Discovery API rate limited (prevent excessive queries)
- [ ] Chat messages rate limited (prevent spam)

### Edge Cases & Error Handling

#### Network Issues
- [ ] WebRTC reconnects gracefully on network hiccup
- [ ] Chat messages queue when offline
- [ ] Session notes save retries on failure
- [ ] API errors display user-friendly messages

#### Browser Compatibility
- [ ] Works in Chrome/Edge (Chromium)
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Mobile browser support
- [ ] Camera/microphone permissions work across browsers

#### Data Edge Cases
- [ ] Profile with no mentoring data handles gracefully
- [ ] Sessions with missing data display safely
- [ ] Empty arrays don't break UI
- [ ] Null/undefined values handled
- [ ] Special characters in inputs handled

#### Concurrent Actions
- [ ] Multiple users editing notes simultaneously
- [ ] Cancelling session while other user viewing
- [ ] Joining session from multiple tabs
- [ ] Race conditions in session status updates

### Performance Checks

- [ ] Pages load within acceptable time (< 3s)
- [ ] Video streams start within 5 seconds
- [ ] No memory leaks in long sessions
- [ ] Database queries are indexed and optimized
- [ ] Large lists paginate properly (50 items limit)

### MongoDB Indexes

Verify these indexes exist:
```javascript
db.mentorSession.getIndexes()
// Should include:
// - { mentorEmail: 1, scheduledAt: -1 }
// - { menteeEmail: 1, scheduledAt: -1 }
// - { sessionId: 1 }

db.profile.getIndexes()
// Should include:
// - { 'mentoring.enabled': 1 }
// - { 'mentoring.expertise': 1 }
```

### Pusher Configuration

Verify Pusher app settings:
- [ ] Client events enabled (for WebRTC signaling)
- [ ] Private channels enabled
- [ ] Presence channels enabled (for chat)
- [ ] Channel limits adequate for expected usage

### Known Limitations

1. **TURN Servers**: Not configured - users behind strict firewalls may have connection issues
2. **Session Recording**: Not implemented - sessions are not recorded
3. **Screen Sharing**: Not implemented
4. **Profile Update API**: Placeholder in form - needs backend implementation
5. **Availability Schedule**: Database model exists but UI not implemented

### Test Environment Requirements

- HTTPS (required for getUserMedia API in production)
- Valid Pusher credentials in .env.local
- MongoDB connection (local or Atlas)
- NextAuth configured with secret
- Modern browser with WebRTC support

## Next Steps After Testing

1. Fix any identified bugs
2. Implement missing features (if required)
3. Add automated tests (Jest, Playwright)
4. Load testing for WebRTC at scale
5. Security audit by professional
