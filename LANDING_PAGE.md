# Energeia Landing Page Implementation

## Overview
A modern, responsive landing page for the Energeia EV Ecosystem Platform built with React Native, Expo Router, and NativeWind (Tailwind CSS for React Native).

## Features Implemented

### Landing Page (`app/index.tsx`)
✅ **App Logo & Branding** - Green gradient circle with lightning bolt icon and "Energeia" branding
✅ **Welcome Text** - "Welcome to Your EV Future" headline
✅ **Platform Description** - Feature card with leaf icon describing the EV ecosystem
✅ **EV Illustration Placeholder** - Dashed border container with electric car icon
✅ **Login Button** - Green outlined button with navigation to login screen
✅ **Create Account Button** - Green gradient button with navigation to register screen
✅ **Smooth Fade Animations** - Content fades in and slides up on page load
✅ **Light Theme UI** - White background with green accents
✅ **Clean Typography** - Responsive text hierarchy
✅ **Mobile Responsive** - Works seamlessly on all screen sizes

### Login Screen (`app/login.tsx`)
- Email and password input fields
- Show/hide password toggle
- Forgot password link
- Sign up link for new users
- Back navigation to landing page
- Smooth fade-in animation

### Register Screen (`app/register.tsx`)
- Full name, email, and password input fields
- Password confirmation field
- Show/hide password toggles
- Terms agreement checkbox
- Login link for existing users
- Back navigation to landing page
- Smooth fade-in animation

## Color Scheme

### Primary Colors
- **Green-500**: `#10b981` - Primary action buttons
- **Emerald-600**: `#059669` - Gradient accent, secondary actions
- **White**: `#ffffff` - Main background
- **Gray-900**: `#111827` - Primary text

### Supporting Colors
- **Gray-600**: `#4b5563` - Secondary text
- **Gray-500**: `#6b7280` - Tertiary text
- **Green-50**: `#f0fdf4` - Light background for features
- **Green-100**: `#dcfce7` - Illustration placeholder background
- **Green-200**: `#bbf7d0` - Borders

## Navigation Flow

```
Landing Page (index.tsx)
├── "Create Account" → Register Screen → Main App (tabs)
├── "Login" → Login Screen → Main App (tabs)
└── Back button on auth screens → Returns to previous screen
```

## Project Structure

```
app/
├── index.tsx              # Landing Page
├── login.tsx              # Login Screen  
├── register.tsx           # Register Screen
├── _layout.tsx            # Root Navigation Layout (updated)
├── (tabs)/
│   ├── index.tsx          # Home tab
│   ├── explore.tsx        # Explore tab
│   └── _layout.tsx        # Tab navigation
└── modal.tsx              # Modal screen

components/               # Reusable UI components
constants/
├── theme.ts              # Color constants
hooks/                    # Custom React hooks
```

## Styling with NativeWind

All components use NativeWind (Tailwind CSS) for styling:

```tsx
// Example: Button styling
<TouchableOpacity className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full py-4">
  <Text className="text-white font-bold text-lg">Create Account</Text>
</TouchableOpacity>
```

### Configuration Files
- **tailwind.config.js** - Tailwind configuration
- **nativewind.json** - NativeWind configuration
- **input.css** - Tailwind directives
- **app/_layout.tsx** - Imports CSS for styling

## Customization Guide

### Change Colors
Edit `tailwind.config.js` in the `theme.extend.colors` section:

```js
colors: {
  primary: '#10b981',      // Change primary green
  secondary: '#059669',    // Change secondary green
  accent: '#34d399',       // Change accent color
}
```

### Change Button Text
Update the `<Text>` components in:
- `app/index.tsx` - Landing page buttons
- `app/login.tsx` - Login form button
- `app/register.tsx` - Register form button

### Add Real Logo
Replace the MaterialCommunityIcons in the branding section with your app logo:

```tsx
// Replace this:
<MaterialCommunityIcons name="lightning-bolt" size={48} color="white" />

// With your logo:
<Image source={require('@/assets/images/logo.png')} style={{ width: 48, height: 48 }} />
```

### Replace Illustration Placeholder
Update the EV illustration section in `app/index.tsx`:

```tsx
// Current placeholder
<MaterialCommunityIcons name="electric-car" size={64} color="#059669" />

// With your actual illustration or image
<Image source={require('@/assets/images/ev-illustration.png')} style={{ width: 300, height: 200 }} />
```

## Authentication Integration

The buttons navigate to screens but don't include backend logic (as per requirements). To add real authentication:

1. Create an authentication context
2. Implement login/register API calls in those screens
3. Update navigation based on authentication state
4. Add JWT token management

Example API call structure:
```tsx
const handleLogin = async () => {
  try {
    const response = await axios.post('/api/auth/login', { email, password });
    // Save token, update auth context
    router.push('/(tabs)');
  } catch (error) {
    // Show error message
  }
};
```

## Animation Details

### Landing Page Animations
- **Fade In**: 0 → 1 opacity over 1 second
- **Slide Up**: 50px down → 0 translateY over 1 second
- Both animations run in parallel for smooth effect

### Login/Register Animations
- Simple fade in over 800ms

Animations use React Native's `Animated` API for optimal performance.

## Icons Used

From `@expo/vector-icons` (MaterialCommunityIcons):
- `lightning-bolt` - App logo
- `leaf` - Platform description feature
- `electric-car` - EV illustration placeholder
- `arrow-left` - Back button
- `email-outline` - Email field icon
- `eye-outline` / `eye-off-outline` - Password toggle
- `account-outline` - Full name field
- `lock-outline` / `lock-check-outline` - Password fields
- `check` - Terms agreement checkbox

## Responsive Design

All layouts are fully responsive:
- **ScrollView** - Vertical scrolling for long content
- **Flexbox** - Flexible layouts that adapt to screen size
- **Padding/Spacing** - Consistent spacing using Tailwind classes
- **Touch Targets** - Buttons sized for easy interaction (44px+ minimum)

## Performance Considerations

✅ **Functional Components** - All components are functional (no class components)
✅ **Memoization Ready** - Can be wrapped with `React.memo` if needed
✅ **Animated Performance** - Uses `useNativeDriver: true` for smooth 60fps animations
✅ **Image Optimization** - Icon-based design reduces asset size
✅ **Code Splitting** - Each screen is a separate route file

## Next Steps

1. **Add Logo Asset** - Replace lightning bolt with actual Energeia logo
2. **Add Illustration** - Create or integrate EV ecosystem illustration
3. **Connect Backend** - Link login/register to actual API endpoints
4. **Add Form Validation** - Validate email/password formats
5. **Implement Theme Switching** - Add dark mode support
6. **Add Loading States** - Show spinners during API calls
7. **Add Error Handling** - Display meaningful error messages
8. **Implement Password Reset** - Add forgot password flow

## Testing

To test the landing page:

```bash
# Start the Expo development server
npm start

# Run on specific platform
npm run ios       # iOS simulator
npm run android   # Android emulator
npm run web       # Web browser
```

Navigate using:
1. Landing page loads by default
2. Click "Create Account" → Register screen
3. Click "Login" from register → Login screen
4. Click "Login" button → Main app tabs
5. Use back button to return

## Browser Support

- ✅ iOS (via Expo Go or built app)
- ✅ Android (via Expo Go or built app)
- ✅ Web (via Expo Web)

---

**Created with**: React Native + Expo + TypeScript + NativeWind
**Last Updated**: May 2026
