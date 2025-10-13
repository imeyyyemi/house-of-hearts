# Visual Flowchart for Online Quiz System

## Overview
This visual flowchart converts the textual diagram into a clear, beginner-friendly diagram for the Online Quiz System. It maps the flow for admins (creating quizzes) and users (taking quizzes, viewing scores), using distinct colors and shapes to differentiate roles. The diagram is designed for the "House of Hearts" group to draw or view during their planning session, helping them understand the system’s structure (Java/Spring Boot backend, SQLite database, HTML/CSS/JS frontend).

## Visual Elements
- **Shapes**:
  - **Oval**: Start/End points (e.g., "Start," "End").
  - **Diamond**: Decision points (e.g., "Is user Admin?").
  - **Rectangle**: Process/action (e.g., "Admin Login," "Calculate Score").
  - **Cylinder**: Database interaction (e.g., "Save to DB").
- **Colors**:
  - **Blue**: Admin Flow (e.g., quiz creation).
  - **Green**: User Flow (e.g., quiz-taking).
  - **Gray**: Shared start/end points.
- **Arrows**: Black arrows with labels (e.g., "Yes," "No") for flow direction.
- **Layout**: Vertical flow with Admin Flow on the left, User Flow on the right, splitting from the central decision point.

## Flowchart Visual Description

### Layout
- **Canvas**: Portrait orientation, split into two columns (Admin Flow left, User Flow right).
- **Spacing**: Evenly spaced nodes (approx. 50px vertical, 100px horizontal between flows).
- **Labels**: Clear, bold text inside shapes (Arial, 12pt); arrow labels for decisions (e.g., "Yes").

### Flowchart Structure

#### Start (Top Center)
- **Shape**: Gray Oval
- **Label**: "Start"
- **Position**: Top center of canvas.
- **Arrow**: Down to decision point.

#### Decision: Role Selection
- **Shape**: Gray Diamond
- **Label**: "Is user Admin?"
- **Position**: Below Start, centered.
- **Arrows**:
  - **Yes (Blue)**: Left to Admin Flow ("Admin Login").
  - **No (Green)**: Right to User Flow ("User Home").

#### Admin Flow (Left Column, Blue Shapes)
1. **Admin Login**
   - **Shape**: Blue Rectangle
   - **Label**: "Admin Login"
   - **Arrow**: Down to "Admin Dashboard"
2. **Admin Dashboard**
   - **Shape**: Blue Rectangle
   - **Label**: "Admin Dashboard"
   - **Arrow**: Down to "Create Quiz"
3. **Create Quiz**
   - **Shape**: Blue Rectangle
   - **Label**: "Create Quiz"
   - **Arrow**: Down to "Enter Quiz Details"
4. **Enter Quiz Details**
   - **Shape**: Blue Rectangle
   - **Label**: "Enter Quiz Details"
   - **Arrow**: Down to "Add Questions"
5. **Add Questions**
   - **Shape**: Blue Rectangle
   - **Label**: "Add Questions"
   - **Arrow**: Down to decision point
6. **Decision: More Questions?**
   - **Shape**: Blue Diamond
   - **Label**: "More Questions?"
   - **Arrows**:
     - **Yes**: Loop back (left) to "Add Questions"
     - **No**: Down to "Save to DB"
7. **Save to DB**
   - **Shape**: Blue Cylinder
   - **Label**: "Save to DB"
   - **Arrow**: Down to "Confirm Creation"
8. **Confirm Creation**
   - **Shape**: Blue Rectangle
   - **Label**: "Confirm Creation"
   - **Arrow**: Down to "Back to Dashboard"
9. **Back to Dashboard**
   - **Shape**: Blue Rectangle
   - **Label**: "Back to Dashboard"
   - **Arrow**: Down to "End"
10. **End**
    - **Shape**: Gray Oval
    - **Label**: "End"
    - **Position**: Bottom of Admin Flow.

#### User Flow (Right Column, Green Shapes)
1. **User Home**
   - **Shape**: Green Rectangle
   - **Label**: "User Home"
   - **Arrow**: Down to "Select Quiz"
2. **Select Quiz**
   - **Shape**: Green Rectangle
   - **Label**: "Select Quiz"
   - **Arrow**: Down to "Start Quiz"
3. **Start Quiz**
   - **Shape**: Green Rectangle
   - **Label**: "Start Quiz"
   - **Arrow**: Down to "Answer Questions"
4. **Answer Questions**
   - **Shape**: Green Rectangle
   - **Label**: "Answer Questions"
   - **Arrow**: Down to decision point
5. **Decision: More Questions?**
   - **Shape**: Green Diamond
   - **Label**: "More Questions?"
   - **Arrows**:
     - **Yes**: Loop back (right) to "Answer Questions"
     - **No**: Down to "Submit Quiz"
6. **Submit Quiz**
   - **Shape**: Green Rectangle
   - **Label**: "Submit Quiz"
   - **Arrow**: Down to "Calculate Score"
7. **Calculate Score**
   - **Shape**: Green Rectangle
   - **Label**: "Calculate Score"
   - **Arrow**: Down to "Save Score to DB"
8. **Save Score to DB**
   - **Shape**: Green Cylinder
   - **Label**: "Save Score to DB"
   - **Arrow**: Down to "Display Score"
9. **Display Score**
   - **Shape**: Green Rectangle
   - **Label**: "Display Score"
   - **Arrow**: Down to "View Profile or Another Quiz"
10. **View Profile or Another Quiz**
    - **Shape**: Green Rectangle
    - **Label**: "View Profile or Another Quiz"
    - **Arrow**: Down to "End"
11. **End**
    - **Shape**: Gray Oval
    - **Label**: "End"
    - **Position**: Bottom of User Flow, aligned with Admin’s End.

## Implementation in Draw.io
1. **Open Draw.io**: Go to https://app.diagrams.net/ (free, no login needed).
2. **Create Canvas**: Choose blank diagram, set portrait orientation.
3. **Add Shapes**:
   - Use Flowchart shapes: Oval (Start/End), Diamond (Decisions), Rectangle (Processes), Cylinder (Database).
   - Drag from left toolbar, place in two columns (Admin left, User right).
4. **Set Colors**:
   - Admin Flow: Fill shapes with light blue (#ADD8E6).
   - User Flow: Fill shapes with light green (#90EE90).
   - Start/End: Gray (#D3D3D3).
5. **Connect Arrows**:
   - Use curved arrows for loops (e.g., "More Questions? → Yes").
   - Label arrows for decisions (e.g., "Yes," "No").
6. **Add Labels**:
   - Double-click shapes, enter text (e.g., "Admin Login").
   - Use bold Arial, 12pt for clarity.
7. **Save/Export**:
   - Save as .drawio file for edits.
   - Export as PNG/PDF for presentation (e.g., Nov 10 or session handout).

## Session Use (Oct 14, 2025, 3:45–5:45 PM)
- **Activity**:
  - **Intro (10 min)**: Show the flowchart on a projector (pre-drawn in Draw.io or sketched live). Say: “This is our map for the Quiz System! Admins make quizzes here, users take them here.”
  - **Draw (30 min)**: Split group: Half draw Admin Flow (blue), half User Flow (green). Use paper or Draw.io on laptops.
  - **Discuss (20 min)**: Merge flows, ask: “What happens if no quizzes exist?” (Show “No quizzes” message). Ensure decision loops are clear.
- **Kid-Friendly Tips**:
  - Use game analogy: “Admins are quiz masters; users are players answering questions.”
  - Highlight colors: “Blue for admins who build, green for users who play.”
  - Engage: “What should we show after a user submits a quiz?” (Answer: Score!)
- **Output**: Save the final diagram (photo of whiteboard or Draw.io export) for their project doc and final presentation.

## Example Visual Layout (Textual Approximation)
```
[Start (Gray Oval)]
       ↓
[Is user Admin? (Gray Diamond)]
   Yes (Blue)       | No (Green)
   ↓                ↓
[Admin Login]     [User Home]
   ↓                ↓
[Admin Dashboard] [Select Quiz]
   ↓                ↓
[Create Quiz]     [Start Quiz]
   ↓                ↓
[Enter Quiz Details] [Answer Questions]
   ↓                ↓
[Add Questions]   [More Questions? (Green Diamond)]
   ↓                Yes ↻    | No
[More Questions? (Blue Diamond)]  ↓
   Yes ↻    | No        [Submit Quiz]
   ↓                ↓
[Save to DB (Cylinder)] [Calculate Score]
   ↓                ↓
[Confirm Creation] [Save Score to DB (Cylinder)]
   ↓                ↓
[Back to Dashboard] [Display Score]
   ↓                ↓
[End (Gray Oval)]  [View Profile or Another Quiz]
                     ↓
                   [End (Gray Oval)]
```