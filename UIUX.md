We put the Dashboard and Logout buttons at opposite ends of Navbar as it is a
 bad design choice ot have buttons with opposite actions in close proximity to
 one another. This was also done for the 'Save Changes' and 'Cancel' buttons
 in SlidesRearrange.jsx.

We found a red colour that would work with the blue colour present in the Navbar
 and some of the buttons in a Triad colour harmony. We added this to our theme.

We added icons to the buttons on the slide editing and slides rearranging pages
 so that the user can efficiently find the tools they need.

The Delete Slide button is red to contrast the other buttons on the edit slide page AppBar. We used a consistent colour (Black) with the rest of the buttons on this bar to reduce the user's distraction by the AppBar.

We added the delete presentation button to the AppBar when the screen size reached the
xs breakpoint to reduce the white space to the right of the menu icon and provide balance.

The buttons on the edit slide AppBar and the menu button that contains these buttons when
the screen gets smaller are arranged in the same order for familiarity. The user
does not have to adjust to a new order of buttons, allowing them to give the same
amount of attention to editing the presentation across all screen sizes.

We created custom breakpoints. The md breakpoint was when the AppBar buttons would
have their text displayed on two lines instead of one which added visual clutter.
At this breakpoint we reduce the number of buttons on the AppBar by adding less
frequently used buttons to a hamburger menu. Once we reach the sm breakpoint all buttons
move to the hamburger button and the delete presentaiton button moves to the 
right of the AppBar. 'Delete Presentation' always appearing on the upper-right of
 the screen introduces familiarity.

At the xxs breaking point the slide navigation buttons move to the bottom
of the screen to give more room for the slide to use the white space below the slide.

The New Element button was placed first in the AppBar buttons as this is the most likely 
to be used. The elements were loosely grouped into these categories:
'Slide creation and element edition' and then 'Theme and thumbnail'.

We used the same font family for all buttons and tooltips. This font is Poppins
which is a sans-serif font. This geometric typeface produces and organic feel
which is inviting to the users. It is almost monolinear and easy to read.

