import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { country, postalCode, state, city } = await request.json();

    if (!country || !postalCode) {
      return NextResponse.json(
        { valid: false, error: "Country and postal code are required" },
        { status: 400 }
      );
    }

    // Validate based on country
    if (country === "USA") {
      return await validateUSAddress(postalCode, state, city);
    } else if (country === "Canada") {
      return await validateCanadianAddress(postalCode, state, city);
    }

    return NextResponse.json({ valid: true, message: "Validation not available for this country" });
  } catch (error) {
    console.error("Address validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Validation service unavailable" },
      { status: 500 }
    );
  }
}

async function validateUSAddress(postalCode: string, state?: string, city?: string) {
  try {
    // Clean up ZIP code (remove -XXXX if present)
    const cleanZip = postalCode.split("-")[0];
    
    // Call Zippopotam.us API for US
    const response = await fetch(`https://api.zippopotam.us/us/${cleanZip}`);
    
    if (!response.ok) {
      return NextResponse.json({
        valid: false,
        error: "Invalid US ZIP code",
      });
    }

    const data = await response.json();
    
    // Extract state and city from response
    const validState = data.places[0]["state abbreviation"];
    const validCities = data.places.map((place: any) => place["place name"].toLowerCase());

    // Validate state if provided
    if (state && validState.toUpperCase() !== state.toUpperCase()) {
      return NextResponse.json({
        valid: false,
        error: `ZIP code ${postalCode} belongs to ${validState}, not ${state}`,
        expectedState: validState,
        expectedCities: data.places.map((p: any) => p["place name"]),
      });
    }

    // Validate city if provided
    if (city && !validCities.includes(city.toLowerCase())) {
      return NextResponse.json({
        valid: false,
        error: `ZIP code ${postalCode} does not match city ${city}`,
        expectedState: validState,
        expectedCities: data.places.map((p: any) => p["place name"]),
      });
    }

    return NextResponse.json({
      valid: true,
      state: validState,
      cities: data.places.map((p: any) => p["place name"]),
      message: "Valid US address",
    });
  } catch (error) {
    console.error("US validation error:", error);
    return NextResponse.json({
      valid: false,
      error: "Unable to validate US address",
    });
  }
}

async function validateCanadianAddress(postalCode: string, state?: string, city?: string) {
  try {
    // Clean up postal code (remove spaces and hyphens)
    const cleanPostalCode = postalCode.replace(/[\s-]/g, "").toUpperCase();
    
    // Extract first 3 characters for Canadian postal code
    const postalPrefix = cleanPostalCode.substring(0, 3);
    
    // Call Zippopotam.us API for Canada
    const response = await fetch(`https://api.zippopotam.us/ca/${postalPrefix}`);
    
    if (!response.ok) {
      return NextResponse.json({
        valid: false,
        error: "Invalid Canadian postal code",
      });
    }

    const data = await response.json();
    
    // Extract province and city from response
    const validProvince = data.places[0]["state abbreviation"];
    const validCities = data.places.map((place: any) => place["place name"].toLowerCase());

    // Validate province if provided
    if (state && validProvince.toUpperCase() !== state.toUpperCase()) {
      return NextResponse.json({
        valid: false,
        error: `Postal code ${postalCode} belongs to ${validProvince}, not ${state}`,
        expectedState: validProvince,
        expectedCities: data.places.map((p: any) => p["place name"]),
      });
    }

    // Validate city if provided (more lenient for Canadian addresses)
    if (city && !validCities.includes(city.toLowerCase())) {
      // Check if city is a partial match
      const cityMatch = validCities.some((validCity: string) => 
        validCity.includes(city.toLowerCase()) || city.toLowerCase().includes(validCity)
      );
      
      if (!cityMatch) {
        return NextResponse.json({
          valid: false,
          error: `Postal code ${postalCode} may not match city ${city}`,
          expectedState: validProvince,
          expectedCities: data.places.map((p: any) => p["place name"]),
          warning: true, // Softer validation for Canadian cities
        });
      }
    }

    return NextResponse.json({
      valid: true,
      state: validProvince,
      cities: data.places.map((p: any) => p["place name"]),
      message: "Valid Canadian address",
    });
  } catch (error) {
    console.error("Canada validation error:", error);
    return NextResponse.json({
      valid: false,
      error: "Unable to validate Canadian address",
    });
  }
}
