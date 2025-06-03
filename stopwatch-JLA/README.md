# Timer Pro - Advanced Stopwatch & Countdown Application

A modern, responsive web-based timer application featuring multiple stopwatch and countdown timers with advanced functionality and beautiful UI design.

## 🚀 Features

### Core Timer Functionality
- **Multiple Timers**: Create unlimited stopwatch and countdown timers
- **Dual Modes**: Switch between stopwatch (chronometer) and countdown timer modes
- **High Precision**: Accurate timing with 10ms precision display
- **Active Timer Management**: Designate one timer as "active" for keyboard control

### Stopwatch Features
- **Start/Stop/Reset**: Basic timer controls with smooth animations
- **Lap Times**: Record and display lap times with split intervals
- **Lap Management**: View all laps with total and split times
- **Clear Laps**: Remove all recorded lap times

### Countdown Features
- **Custom Time Setting**: Set hours, minutes, and seconds
- **Progress Visualization**: Real-time progress bar showing remaining time
- **Visual Alerts**: Flashing animation when countdown completes
- **Sound Notifications**: Audio alerts for timer completion

### User Interface
- **Modern Design**: Clean, professional interface with smooth animations
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **Visual Feedback**: Status indicators, hover effects, and smooth transitions

### Advanced Features
- **Keyboard Shortcuts**: Complete keyboard control for power users
- **Data Persistence**: Automatic saving of timers and settings
- **Export/Import**: Backup and restore timer configurations
- **Fullscreen Mode**: Distraction-free timing experience
- **Sound Control**: Configurable audio feedback
- **Browser Notifications**: Desktop notifications for countdown completion

## 🎯 Live Demo

Open `index.html` in your web browser to start using the application immediately. No installation or build process required!

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start/Stop active timer |
| `R` | Reset active timer |
| `L` | Add lap time (stopwatch only) |
| `T` | Switch between stopwatch/countdown modes |
| `A` | Add new timer |
| `H` | Toggle keyboard shortcuts help |
| `F` | Toggle fullscreen mode |

## 📖 Usage Guide

### Getting Started
1. Open the application in your web browser
2. Use the mode tabs to switch between "Stopwatch" and "Countdown"
3. Click "Add Timer" to create your first timer

### Using Stopwatch Mode
1. Click "Start" to begin timing
2. Use "Lap" to record split times while running
3. Click "Pause" to temporarily stop the timer
4. Click "Reset" to return to 00:00:00

### Using Countdown Mode
1. Set your desired time using the Hours, Minutes, Seconds inputs
2. Click "Set Time" to confirm your countdown duration
3. Click "Start" to begin the countdown
4. Watch the progress bar and time display
5. Receive alerts when the countdown reaches zero

### Managing Multiple Timers
- **Add Timers**: Click the "+" button to create additional timers
- **Active Timer**: Click the "★" button to set a timer as active for keyboard control
- **Duplicate**: Click the "⧉" button to copy a timer with the same settings
- **Delete**: Click the "×" button to remove a timer

### Theme and Settings
- **Theme Toggle**: Click the moon/sun icon to switch between light and dark themes
- **Help**: Click the "?" button to view keyboard shortcuts
- **Fullscreen**: Click the fullscreen icon for immersive timing

## 🛠️ Technical Features

### Architecture
- **Object-Oriented Design**: Clean Timer and TimerApp classes
- **Event-Driven**: Responsive to user interactions and system events
- **State Management**: Persistent storage of all timer states and settings
- **Modular CSS**: Organized styling with CSS custom properties

### Performance
- **Efficient Updates**: 50ms update intervals for smooth display
- **Memory Management**: Proper cleanup of intervals and event listeners
- **Local Storage**: Automatic saving every 30 seconds and on page unload
- **Optimized Rendering**: Minimal DOM manipulation for smooth performance

### Accessibility
- **ARIA Labels**: Comprehensive labeling for screen readers
- **Keyboard Navigation**: Full functionality without mouse
- **High Contrast Support**: Automatic adaptation for accessibility needs
- **Reduced Motion**: Respects user's motion preferences
- **Focus Management**: Clear visual focus indicators

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (ES6+ required)
- **Mobile Support**: Touch-friendly interface for phones and tablets
- **Responsive Design**: Adapts to all screen sizes
- **Offline Capable**: Works without internet connection

## 🎨 Design System

### Color Scheme
- **Primary**: Blue (#2563eb) - Main actions and highlights
- **Success**: Green (#10b981) - Running timers and positive actions
- **Warning**: Amber (#f59e0b) - Paused states and cautions
- **Danger**: Red (#ef4444) - Delete actions and alerts

### Typography
- **Interface**: Inter font family for clean, modern text
- **Timers**: JetBrains Mono for precise, monospaced time display
- **Hierarchy**: Clear size and weight distinctions

### Spacing
- **Consistent Scale**: 0.25rem increments for uniform spacing
- **Responsive**: Adapts spacing for different screen sizes
- **Breathing Room**: Generous padding for comfortable interaction

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (Multi-column timer layout)
- **Tablet**: 768px-1199px (Single column, larger controls)
- **Mobile**: 480px-767px (Stacked layout, touch-optimized)
- **Small Mobile**: <480px (Compressed layout, minimal spacing)

## 💾 Data Management

### Local Storage
- **Settings**: Theme, sound preferences, active timer
- **Timers**: All timer states, lap times, and configurations
- **Auto-Save**: Periodic saves every 30 seconds
- **Recovery**: Restore timers when page reloads

### Export/Import
- **JSON Format**: Human-readable backup files
- **Complete State**: Includes all timers, settings, and data
- **Date Stamped**: Backup files include creation timestamp

## 🔊 Audio Features

### Sound Effects
- **Start Sound**: Subtle audio cue when starting timers
- **Stop Sound**: Confirmation when pausing timers
- **Alarm Sound**: Prominent alert when countdown completes
- **Volume Control**: System volume integration

### Browser Notifications
- **Permission Request**: Asks for notification permission on first use
- **Countdown Alerts**: Desktop notifications when timers complete
- **Background Support**: Notifications work when tab is not active

## 🚀 Performance Optimizations

### Efficient Rendering
- **RAF Updates**: Uses requestAnimationFrame for smooth animations
- **Minimal Reflow**: Optimized CSS for performance
- **Event Delegation**: Efficient event handling for multiple timers

### Memory Management
- **Cleanup**: Proper disposal of intervals and listeners
- **Throttling**: Limited update frequency for performance
- **Lazy Loading**: Components created only when needed

## 🐛 Browser Support

### Minimum Requirements
- **JavaScript**: ES6+ support (2015 and later)
- **CSS**: Custom properties and grid support
- **Features**: Local Storage, Audio API, Notification API

### Tested Browsers
- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or create issues for bugs and feature requests.

## 📞 Support

For questions or support, please create an issue on the project repository.

---

**Timer Pro** - Making time management beautiful and efficient. ⏱️ 