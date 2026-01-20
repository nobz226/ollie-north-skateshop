# Address Validation System

## Overview
The Ollie North Skateshop implements real-time address validation using the free Zippopotam.us API. This validates that postal codes match the selected state/province and city for both USA and Canada addresses.

## Features

### ✅ Real-time Validation
- Validates postal codes as users type (with 500ms debounce)
- Checks that ZIP/postal codes match the selected state/province
- Verifies city names against postal code database
- Provides immediate visual feedback

### ✅ Visual Feedback
- **Validating** (Blue): API call in progress
- **Valid** (Green): Address verified successfully
- **Invalid** (Red): Mismatch detected with suggestions
- **Neutral** (Gray): Validation service unavailable

### ✅ Smart Suggestions
When validation fails, the system provides:
- Expected state/province for the postal code
- List of valid cities for that postal code
- Option to proceed anyway (for edge cases)

## How It Works

### API Endpoint: `/api/validate-address`

**Request:**
```json
POST /api/validate-address
{
  "country": "USA" | "Canada",
  "postalCode": "90210",
  "state": "CA",
  "city": "Beverly Hills"
}
```

**Response (Success):**
```json
{
  "valid": true,
  "state": "CA",
  "cities": ["Beverly Hills"],
  "message": "Valid US address"
}
```

**Response (Failure):**
```json
{
  "valid": false,
  "error": "ZIP code 90210 belongs to CA, not NY",
  "expectedState": "CA",
  "expectedCities": ["Beverly Hills"]
}
```

### Implementation Details

#### USA Validation
- Uses Zippopotam.us API: `https://api.zippopotam.us/us/{zipCode}`
- Supports 5-digit ZIP codes
- Automatically strips the +4 extension (e.g., 12345-6789 → 12345)
- Validates against all 50 US states

#### Canada Validation
- Uses Zippopotam.us API: `https://api.zippopotam.us/ca/{postalPrefix}`
- Validates postal code format: A1A 1A1
- Uses first 3 characters (Forward Sortation Area)
- More lenient city matching (allows partial matches)
- Supports all 13 provinces/territories

## Integration Points

### Checkout Page (`src/app/checkout/page.tsx`)
- Real-time validation as user fills shipping form
- Warning dialog if validation fails before order submission
- Option to proceed despite validation warnings

### Profile Page (`src/app/profile/page.tsx`)
- Validation only when editing shipping address
- Same warning system before saving
- Resets validation state when not editing

## User Experience Flow

1. **User selects country** → Dropdown shows USA or Canada
2. **User selects state/province** → Dropdown populated based on country
3. **User enters city** → Text input with validation pattern
4. **User enters postal code** → Triggers validation after 500ms
5. **Validation feedback** → Shows color-coded message with suggestions
6. **User submits** → Confirms if validation failed, otherwise proceeds

## Technical Specifications

### Dependencies
- **Zippopotam.us API**: Free, no API key required
- **Next.js API Routes**: Server-side validation endpoint
- **React useEffect**: Debounced validation trigger
- **Fetch API**: HTTP requests to validation service

### Error Handling
- Network errors → Shows "Unable to validate address"
- Invalid postal codes → Shows "Invalid {country} postal code"
- Service unavailable → Allows user to proceed with warning
- Format errors → Client-side validation before API call

### Performance
- **Debounce**: 500ms delay prevents excessive API calls
- **Format check first**: Validates format before API call
- **Conditional validation**: Only runs when all fields populated
- **Cleanup**: Properly cancels pending requests on unmount

## Limitations

### Current Scope
- Only supports USA and Canada
- Requires internet connection for validation
- Depends on third-party API availability
- Basic postal code database (may miss some edge cases)

### Not Validated
- Address line 1 and 2 (street addresses)
- Phone number geography
- Actual existence of physical address
- Apartment/unit numbers

## Future Enhancements

### Potential Improvements
1. **More countries**: Add UK, Australia, etc. validation
2. **Street address validation**: Integrate Google Maps Geocoding API
3. **Autocomplete**: Suggest cities/addresses as user types
4. **Offline mode**: Cache common postal code data
5. **Business validation**: Verify business addresses separately
6. **International phone**: Validate phone format per country

### Alternative APIs
If Zippopotam.us becomes unavailable:
- **Google Maps Geocoding API** (requires billing, very accurate)
- **SmartyStreets** (commercial, highly reliable)
- **Mapbox** (good free tier)
- **OpenCage Geocoding** (open-source friendly)

## Testing

### Test Cases

**Valid USA Address:**
- ZIP: 90210
- State: CA
- City: Beverly Hills
- Expected: ✅ Valid

**Invalid USA Address:**
- ZIP: 90210
- State: NY
- City: New York
- Expected: ❌ "ZIP code 90210 belongs to CA, not NY"

**Valid Canada Address:**
- Postal Code: M5H 2N2
- Province: ON
- City: Toronto
- Expected: ✅ Valid

**Invalid Format:**
- ZIP: 1234 (only 4 digits)
- Expected: ❌ "Invalid ZIP code format" (client-side)

## Maintenance

### Monitoring
- Check Zippopotam.us API status: https://www.zippopotam.us/
- Monitor error logs in production for validation failures
- Track validation success/failure rates

### Updates Needed
- None for postal code database (maintained by Zippopotam.us)
- Update state/province lists only if new ones added
- Review validation logic if API response format changes

## Support

For issues or questions about address validation:
1. Check API status at https://www.zippopotam.us/
2. Review browser console for validation errors
3. Test with known-good addresses
4. Consider user feedback for false positives
