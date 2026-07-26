# 📱 Skill.md - Android Developer Guide

> **Complete reference for building production-ready Android applications**
> 
> *From setup to deployment - Best practices, architecture patterns, and coding standards*

---

## 📑 Table of Contents

1. [Getting Started](#getting-started)
2. [Project Architecture](#project-architecture)
3. [Code Standards](#code-standards)
4. [Code.md Template](#codemd-template)
5. [UI/UX Guidelines](#uiux-guidelines)
6. [Data Management](#data-management)
7. [Testing](#testing)
8. [Security](#security)
9. [Performance](#performance)
10. [Deployment](#deployment)
11. [Tools & Resources](#tools--resources)

---

## 🚀 Getting Started

### Required Tools

| Tool | Purpose | Version |
|------|---------|---------|
| Android Studio | IDE | 2024.1+ |
| Java / Kotlin | Language | JDK 17+ |
| Gradle | Build system | 8.4+ |
| Android SDK | Platform | API 34+ |

### Project Setup

```bash
# Clone repository
git clone https://github.com/Pankajpavan5/SHIVKRUPA-RESTARURANT-POS.git

# Open in Android Studio
# File → Open → Select project folder

# Sync Gradle
# File → Sync Project with Gradle Files
```

### Build & Run

```bash
# Debug build
./gradlew assembleDebug

# Release build
./gradlew assembleRelease

# Install on device
adb install app/build/outputs/apk/debug/app-debug.apk
```

---

## 🏗️ Project Architecture

### MVVM Pattern

```
┌─────────────────────────────────────────────────────────┐
│                        UI Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │  Activity   │  │  Fragment   │  │   Composable    │ │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘ │
└─────────┼────────────────┼──────────────────┼──────────┘
          │                │                  │
          ▼                ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                    ViewModel Layer                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │            ViewModel (State, Events)            │   │
│  └──────────────────────┬──────────────────────────┘   │
└─────────────────────────┼──────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Domain Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │  Use Cases  │  │   Models    │  │   Repository    │ │
│  └─────────────┘  └─────────────┘  │   Interfaces   │ │
│                                    └────────┬────────┘  │
└────────────────────────────────────────────┼───────────┘
                                             │
                                             ▼
┌─────────────────────────────────────────────────────────┐
│                     Data Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │ Repository  │  │   Remote    │  │     Local       │ │
│  │    Impl     │  │  (Retrofit) │  │   (Room/DB)     │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Directory Structure

```
app/src/main/
├── java/com/example/app/
│   ├── data/
│   │   ├── local/          # Room DB, SharedPrefs
│   │   ├── remote/         # API services
│   │   ├── repository/     # Repository implementations
│   │   └── model/          # Data models (DTOs)
│   │
│   ├── domain/
│   │   ├── model/          # Domain models
│   │   ├── repository/     # Repository interfaces
│   │   └── usecase/        # Business logic
│   │
│   ├── ui/
│   │   ├── feature/
│   │   │   ├── feature1/
│   │   │   │   ├── Feature1Activity.kt
│   │   │   │   ├── Feature1ViewModel.kt
│   │   │   │   └── Feature1Screen.kt
│   │   │   └── feature2/
│   │   ├── common/
│   │   │   ├── components/ # Reusable UI components
│   │   │   ├── theme/     # Colors, Typography
│   │   │   └── navigation/
│   │   └── MainActivity.kt
│   │
│   ├── di/                 # Dependency Injection
│   │   ├── AppModule.kt
│   │   └── ViewModelModule.kt
│   │
│   └── util/               # Utilities, Extensions
│       ├── Constants.kt
│       └── Extensions.kt
│
├── res/
│   ├── drawable/
│   ├── layout/
│   ├── values/
│   │   ├── colors.xml
│   │   ├── strings.xml
│   │   ├── themes.xml
│   │   └── dimens.xml
│   └── xml/
│
└── AndroidManifest.xml
```

---

## 📝 Code Standards

### Kotlin Style Guide

#### Naming Conventions

```kotlin
// Classes: PascalCase
class UserRepository { }
class MainActivity : AppCompatActivity() { }

// Functions: camelCase
fun fetchUserData() { }
fun calculateTotal(): Double { }

// Variables: camelCase
val userName = "John"
var isLoading = false

// Constants: SCREAMING_SNAKE_CASE
companion object {
    const val MAX_RETRY_COUNT = 3
    const val API_BASE_URL = "https://api.example.com"
}

// Boolean: is/has/can prefix
val isActive = true
val hasPermission = true
val canEdit = false
```

#### Class Organization

```kotlin
class UserManager(
    private val repository: UserRepository,
    private val cache: CacheManager
) {
    // 1. Companion object (constants)
    companion object {
        private const val TAG = "UserManager"
    }
    
    // 2. Properties
    private var currentUser: User? = null
    val isLoggedIn: Boolean get() = currentUser != null
    
    // 3. Init block
    init {
        initialize()
    }
    
    // 4. Public functions
    fun login(email: String, password: String): Result<User> {
        // ...
    }
    
    fun logout() {
        // ...
    }
    
    // 5. Private functions
    private fun initialize() {
        // ...
    }
    
    // 6. Nested classes (if needed)
    data class UserConfig(val timeout: Long)
}
```

#### Function Guidelines

```kotlin
// ✅ Good: Single responsibility, descriptive name
fun calculateOrderTotal(items: List<OrderItem>, taxRate: Double): Double {
    val subtotal = items.sumOf { it.price * it.quantity }
    return subtotal * (1 + taxRate)
}

// ✅ Good: Default parameters
fun showToast(message: String, duration: Int = Toast.LENGTH_SHORT) {
    Toast.makeText(context, message, duration).show()
}

// ✅ Good: Named parameters for clarity
updateUser(
    name = "John",
    age = 30,
    isActive = true
)

// ❌ Bad: Too many parameters
fun createUser(n: String, a: Int, e: String, p: String, a2: Boolean): User { }

// ✅ Better: Use data class
fun createUser(config: UserConfig): User { }
```

### XML Layout Standards

```xml
<!-- ✅ Good: Descriptive IDs, proper formatting -->
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/containerLayout"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="16dp">

    <TextView
        android:id="@+id/titleText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/app_title"
        android:textSize="24sp"
        android:textColor="@color/primary"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>

<!-- ❌ Bad: Generic IDs, no constraints -->
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <TextView
        android:id="@+id/tv1"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />
        
</LinearLayout>
```

---

## 📄 Code.md Template

> Every feature should have a corresponding `code.md` file documenting its implementation.

### Template Structure

```markdown
# Feature Name - Code Documentation

> **Status:** ✅ Complete | 🚧 In Progress | 📋 Planned
> 
> **Last Updated:** YYYY-MM-DD
> 
> **Developer:** Your Name

---

## Overview

Brief description of what this feature does and why it exists.

### User Story
```
As a [user type]
I want to [action]
So that [benefit]
```

---

## Implementation

### Files Modified/Created

| File | Type | Description |
|------|------|-------------|
| `FeatureActivity.kt` | Activity | Main entry point |
| `FeatureViewModel.kt` | ViewModel | State management |
| `feature_item.xml` | Layout | UI layout |

### Data Flow

```
User Action → Activity → ViewModel → Repository → API/DB
                ↓
            Update UI (State)
```

### Key Functions

#### `initFeature()`
**Purpose:** Initialize feature components

```kotlin
private fun initFeature() {
    setupRecyclerView()
    loadInitialData()
    observeState()
}
```

#### `onItemClick(item: Item)`
**Purpose:** Handle item selection

**Parameters:**
- `item: Item` - The clicked item

**Returns:** `Unit`

**Logic:**
1. Navigate to detail screen
2. Track analytics event

---

## State Management

```kotlin
data class FeatureState(
    val isLoading: Boolean = false,
    val items: List<Item> = emptyList(),
    val error: String? = null,
    val selectedItem: Item? = null
)
```

---

## API Contract

### Endpoint: `GET /api/feature/items`

**Request:**
```json
{
  "page": 1,
  "limit": 20
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "name": "Item Name",
      "price": 99.99
    }
  ],
  "pagination": {
    "page": 1,
    "totalPages": 5,
    "totalItems": 100
  }
}
```

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Empty data | Show empty state with illustration |
| Network error | Show retry button with error message |
| Slow loading | Show skeleton/shimmer effect |
| Large dataset | Implement pagination or infinite scroll |

---

## Testing

### Unit Tests
- ViewModel logic
- Repository methods
- Utility functions

### UI Tests
- Screen navigation
- User interactions
- Error handling display

---

## Future Improvements

- [ ] Add pull-to-refresh
- [ ] Implement offline caching
- [ ] Add search functionality

---

## Related Files

- `RelatedFeature.kt` - Uses shared repository
- `CommonUtils.kt` - Shared utilities

---

*Document version: 1.0*
```

---

## 🎨 UI/UX Guidelines

### Material Design 3

```xml
<!-- colors.xml -->
<resources>
    <!-- Primary -->
    <color name="md_theme_primary">#3D5AFE</color>
    <color name="md_theme_onPrimary">#FFFFFF</color>
    <color name="md_theme_primaryContainer">#E3E7FF</color>
    <color name="md_theme_onPrimaryContainer">#001356</color>
    
    <!-- Secondary -->
    <color name="md_theme_secondary">#5C5D72</color>
    <color name="md_theme_onSecondary">#FFFFFF</color>
    <color name="md_theme_secondaryContainer">#E1E0F9</color>
    
    <!-- Error -->
    <color name="md_theme_error">#BA1A1A</color>
    <color name="md_theme_onError">#FFFFFF</color>
    
    <!-- Background -->
    <color name="md_theme_background">#FFFBFE</color>
    <color name="md_theme_onBackground">#1C1B1F</color>
    
    <!-- Surface -->
    <color name="md_theme_surface">#FFFBFE</color>
    <color name="md_theme_onSurface">#1C1B1F</color>
</resources>
```

### Typography Scale

```xml
<!-- typography.xml -->
<resources>
    <!-- Display -->
    <style name="TextAppearance.App.DisplayLarge" parent="TextAppearance.Material3.DisplayLarge">
        <item name="android:textSize">57sp</item>
        <item name="android:letterSpacing">-0.25</item>
    </style>
    
    <!-- Headline -->
    <style name="TextAppearance.App.HeadlineMedium" parent="TextAppearance.Material3.HeadlineMedium">
        <item name="android:textSize">28sp</item>
    </style>
    
    <!-- Title -->
    <style name="TextAppearance.App.TitleLarge" parent="TextAppearance.Material3.TitleLarge">
        <item name="android:textSize">22sp</item>
    </style>
    
    <!-- Body -->
    <style name="TextAppearance.App.BodyLarge" parent="TextAppearance.Material3.BodyLarge">
        <item name="android:textSize">16sp</item>
    </style>
    
    <!-- Label -->
    <style name="TextAppearance.App.LabelMedium" parent="TextAppearance.Material3.LabelMedium">
        <item name="android:textSize">12sp</item>
    </style>
</resources>
```

### Spacing System

```kotlin
// dimens.kt
object Spacing {
    val xs = 4.dp
    val sm = 8.dp
    val md = 16.dp
    val lg = 24.dp
    val xl = 32.dp
    val xxl = 48.dp
    
    val screenPadding = 16.dp
    val cardPadding = 12.dp
    val itemSpacing = 8.dp
}
```

### Component Guidelines

#### Buttons
```xml
<!-- Primary Button -->
<com.google.android.material.button.MaterialButton
    android:id="@+id/btnSubmit"
    android:layout_width="match_parent"
    android:layout_height="56dp"
    android:text="@string/submit"
    app:cornerRadius="12dp" />

<!-- Outlined Button -->
<com.google.android.material.button.MaterialButton
    style="@style/Widget.Material3.Button.OutlinedButton"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/cancel" />
```

#### Cards
```xml
<com.google.android.material.card.MaterialCardView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:cardCornerRadius="16dp"
    app:cardElevation="2dp"
    app:strokeWidth="0dp">
    
    <!-- Card content -->
    
</com.google.android.material.card.MaterialCardView>
```

#### Loading States
```xml
<!-- Shimmer effect for loading -->
<com.facebook.shimmer.ShimmerFrameLayout
    android:id="@+id/shimmerLayout"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">
    
    <include layout="@layout/placeholder_item" />
    
</com.facebook.shimmer.ShimmerFrameLayout>
```

---

## 💾 Data Management

### Room Database

```kotlin
// Entity
@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey
    val id: String,
    val name: String,
    val email: String,
    val createdAt: Long = System.currentTimeMillis()
)

// DAO
@Dao
interface UserDao {
    @Query("SELECT * FROM users")
    fun getAllUsers(): Flow<List<UserEntity>>
    
    @Query("SELECT * FROM users WHERE id = :id")
    suspend fun getUserById(id: String): UserEntity?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: UserEntity)
    
    @Delete
    suspend fun deleteUser(user: UserEntity)
}

// Database
@Database(entities = [UserEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
}
```

### SharedPreferences

```kotlin
// PreferencesManager.kt
class PreferencesManager(context: Context) {
    private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    
    var authToken: String?
        get() = prefs.getString(KEY_AUTH_TOKEN, null)
        set(value) = prefs.edit().putString(KEY_AUTH_TOKEN, value).apply()
    
    var userId: String?
        get() = prefs.getString(KEY_USER_ID, null)
        set(value) = prefs.edit().putString(KEY_USER_ID, value).apply()
    
    var isDarkMode: Boolean
        get() = prefs.getBoolean(KEY_DARK_MODE, false)
        set(value) = prefs.edit().putBoolean(KEY_DARK_MODE, value).apply()
    
    fun clearAll() {
        prefs.edit().clear().apply()
    }
    
    companion object {
        private const val PREFS_NAME = "app_preferences"
        private const val KEY_AUTH_TOKEN = "auth_token"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_DARK_MODE = "dark_mode"
    }
}
```

### Repository Pattern

```kotlin
// Repository Interface
interface UserRepository {
    fun getUsers(): Flow<List<User>>
    suspend fun getUserById(id: String): Result<User>
    suspend fun createUser(user: User): Result<User>
    suspend fun updateUser(user: User): Result<User>
    suspend fun deleteUser(id: String): Result<Unit>
}

// Repository Implementation
class UserRepositoryImpl(
    private val api: UserApi,
    private val dao: UserDao,
    private val networkMonitor: NetworkMonitor
) : UserRepository {
    
    override fun getUsers(): Flow<List<User>> = flow {
        // Emit cached data first
        dao.getAllUsers().collect { entities ->
            emit(entities.map { it.toDomain() })
        }
        
        // Fetch from network if available
        if (networkMonitor.isOnline()) {
            try {
                val remoteUsers = api.getUsers()
                dao.insertUsers(remoteUsers.map { it.toEntity() })
            } catch (e: Exception) {
                // Network error - cached data already emitted
                Log.e(TAG, "Failed to fetch users", e)
            }
        }
    }.flowOn(Dispatchers.IO)
}
```

---

## 🧪 Testing

### Unit Testing

```kotlin
// Example: ViewModel Test
@OptIn(ExperimentalCoroutinesApi::class)
class OrderViewModelTest {
    
    private val viewModel: OrderViewModel
    private val repository: MockOrderRepository
    
    @Before
    fun setup() {
        repository = MockOrderRepository()
        viewModel = OrderViewModel(repository)
    }
    
    @Test
    fun `calculateTotal returns correct sum`() = runTest {
        val items = listOf(
            OrderItem(name = "Item 1", price = 10.0, quantity = 2),
            OrderItem(name = "Item 2", price = 15.0, quantity = 1)
        )
        
        val total = viewModel.calculateTotal(items)
        
        assertEquals(35.0, total, 0.01)
    }
    
    @Test
    fun `loadOrders emits loading then success`() = runTest {
        repository.mockOrders = sampleOrders
        
        viewModel.loadOrders()
        
        viewModel.uiState.test {
            assertEquals(UiState.Loading, awaitItem())
            assertEquals(UiState.Success(sampleOrders), awaitItem())
        }
    }
}
```

### UI Testing

```kotlin
// Example: Espresso Test
@LargeTest
class LoginScreenTest {
    
    @get:Rule
    val activityScenario = ActivityScenarioRule(LoginActivity::class.java)
    
    @Test
    fun `login button is disabled when fields are empty`() {
        onView(withId(R.id.emailInput)).fillIn("")
        onView(withId(R.id.passwordInput)).fillIn("")
        
        onView(withId(R.id.loginButton)).check(matches(isNotEnabled()))
    }
    
    @Test
    fun `successful login navigates to home`() {
        // Fill in credentials
        onView(withId(R.id.emailInput)).fillIn("test@example.com")
        onView(withId(R.id.passwordInput)).fillIn("password123")
        
        // Tap login
        onView(withId(R.id.loginButton)).perform(click())
        
        // Verify navigation
        intended(hasComponent(HomeActivity::class.java))
    }
}
```

---

## 🔒 Security

### API Security

```kotlin
// OkHttp Interceptor for Auth
class AuthInterceptor(
    private val tokenProvider: TokenProvider
) : Interceptor {
    
    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()
        
        val token = tokenProvider.getToken() ?: return chain.proceed(originalRequest)
        
        val authenticatedRequest = originalRequest.newBuilder()
            .header("Authorization", "Bearer $token")
            .header("X-App-Version", BuildConfig.VERSION_NAME)
            .build()
        
        return chain.proceed(authenticatedRequest)
    }
}
```

### Data Encryption

```kotlin
// Encrypted SharedPreferences
val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

val securePrefs = EncryptedSharedPreferences.create(
    context,
    "secure_prefs",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)

// Store sensitive data
securePrefs.edit().apply {
    putString("api_key", encryptedApiKey)
    apply()
}
```

### ProGuard Rules

```proguard
# Keep data models
-keepclassmembers class com.example.app.data.model.** { *; }

# Retrofit
-keepattributes Signature
-keepattributes *Annotation*
-keep class retrofit2.** { *; }
-keepclassmembers,allowshrinking,allowobfuscation interface * {
    @retrofit2.http.* <methods>;
}

# Room
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class *
```

---

## ⚡ Performance

### Lazy Loading

```kotlin
// Lazy initialization
class MyFragment : Fragment() {
    
    private val viewModel: MyViewModel by viewModels()
    
    private val heavyAdapter by lazy {
        HeavyAdapter()
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        recyclerView.adapter = heavyAdapter
    }
}
```

### Image Loading

```kotlin
// Coil for image loading
Image(
    painter = coil.imagePainter(data = imageUrl),
    contentDescription = "Product image",
    modifier = Modifier
        .size(120.dp)
        .clip(RoundedCornerShape(8.dp)),
    contentScale = ContentScale.Crop
)

// Or with placeholder
imageView.load(url) {
    placeholder(R.drawable.placeholder)
    error(R.drawable.error_image)
    crossfade(true)
}
```

### Pagination

```kotlin
// Paging 3
@OptIn(ExperimentalPagingApi::class)
fun getOrdersPaged(): Flow<PagingData<Order>> {
    return Pager(
        config = PagingConfig(
            pageSize = 20,
            enablePlaceholders = false,
            prefetchDistance = 5
        ),
        remoteMediator = OrderRemoteMediator(db, api),
        pagingSourceFactory = { db.orderDao().pagingSource() }
    ).flow
}
```

---

## 🚀 Deployment

### Build Variants

```groovy
// build.gradle.kts
android {
    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
            isDebuggable = true
        }
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    
    flavorDimensions += "environment"
    productFlavors {
        create("dev") {
            dimension = "environment"
            applicationIdSuffix = ".dev"
            buildConfigField("String", "BASE_URL", "\"https://dev.api.example.com/\"")
        }
        create("staging") {
            dimension = "environment"
            applicationIdSuffix = ".staging"
            buildConfigField("String", "BASE_URL", "\"https://staging.api.example.com/\"")
        }
        create("production") {
            dimension = "environment"
            buildConfigField("String", "BASE_URL", "\"https://api.example.com/\"")
        }
    }
}
```

### App Bundle (AAB)

```bash
# Generate AAB for Play Store
./gradlew bundleRelease

# Output location
# app/build/outputs/bundle/release/app-release.aab
```

### APK Generation

```bash
# Debug APK
./gradlew assembleDebug

# Release APK (unsigned)
./gradlew assembleRelease

# Signed APK
./gradlew assembleRelease \
    -Pkeystore=keystore.jks \
    -PkeystorePassword=password \
    -PkeyAlias=alias \
    -PkeyPassword=keyPassword
```

### Version Management

```kotlin
// BuildConfig (auto-generated)
BuildConfig.VERSION_NAME    // "1.2.3"
BuildConfig.VERSION_CODE    // 12
BuildConfig.BUILD_TYPE      // "debug" or "release"
BuildConfig.FLAVOR          // "production"

// Semantic Versioning
// MAJOR.MINOR.PATCH
// 1.2.3
// | | └── Patch: Bug fixes
// | └──── Minor: New features (backward compatible)
// └────── Major: Breaking changes
```

---

## 🛠️ Tools & Resources

### Essential Libraries

| Category | Library | Purpose |
|----------|---------|---------|
| DI | Hilt | Dependency injection |
| Network | Retrofit + OkHttp | API calls |
| Database | Room | Local storage |
| Images | Coil | Image loading |
| Async | Coroutines + Flow | Async operations |
| Navigation | Navigation Component | Screen navigation |
| UI | Material Components | UI components |
| JSON | Kotlinx Serialization | JSON parsing |

### Useful Commands

```bash
# Clean build
./gradlew clean

# List dependencies
./gradlew dependencies

# Check for updates
./gradlew dependencyUpdates

# Run lint
./gradlew lint

# Generate APK
./gradlew assembleDebug

# Sign APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
    -keystore my-release-key.keystore \
    app-release-unsigned.apk alias_name
```

### Debug Tools

```kotlin
// Log with tag
Log.d(TAG, "User logged in: ${user.email}")

// Debug-only code
if (BuildConfig.DEBUG) {
    // Show debug info
}

// Stetho for network inspection
// Enable in debug build only
```

---

## 📋 Checklist

### Before Commit

- [ ] Code follows style guide
- [ ] No hardcoded strings (use resources)
- [ ] Proper error handling
- [ ] Unit tests pass
- [ ] No sensitive data in code
- [ ] Updated code.md if needed

### Before Release

- [ ] All build variants tested
- [ ] ProGuard/R8 rules configured
- [ ] Crash reporting enabled
- [ ] Analytics integrated
- [ ] Version updated
- [ ] Release notes prepared
- [ ] AAB/APK generated

---

## 📚 Additional Resources

- [Android Developers Guide](https://developer.android.com/guide)
- [Kotlin Documentation](https://kotlinlang.org/docs/home.html)
- [Material Design 3](https://m3.material.io/)
- [Jetpack Components](https://developer.android.com/jetpack)
- [Android Performance](https://developer.android.com/topic/performance)

---

*Last Updated: 2024*
*Version: 1.0*
