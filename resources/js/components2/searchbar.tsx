import React, { useState, useRef, useEffect } from "react";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme style file
import { format } from "date-fns";
import { RiSearchLine } from "react-icons/ri";

// Define types for props and state
interface SearchBarProps {
  onSearch?: (searchParams: SearchParams) => void;
}

type RoomType = "standard" | "deluxe" | "";

interface SearchParams {
  dateRange: Range[];
  adults: number;
  children: number;
  roomType: RoomType;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  // State management
  const [searchParams, setSearchParams] = useState<SearchParams>({
    dateRange: [
      { startDate: new Date(), endDate: new Date(), key: "selection" },
    ],
    adults: 1,
    children: 0,
    roomType: ""
  });
  const [openCalendar, setOpenCalendar] = useState(false);
  const [focused, setFocused] = useState("");
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setOpenCalendar(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle date range changes
  const handleDateChange = (ranges: RangeKeyDict) => {
    const { selection } = ranges;
    setSearchParams(prev => ({
      ...prev,
      dateRange: [selection]
    }));
  };

  // Handle numeric input changes
  const handleInputChange = (field: 'adults' | 'children', value: string) => {
    const numValue = parseInt(value) || 0;
    setSearchParams(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  // Handle room type change
  const handleRoomTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams(prev => ({
      ...prev,
      roomType: e.target.value as RoomType
    }));
  };

  // Handle search button click
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchParams);
    }
    console.log("Search params:", searchParams);
  };

  // Format the display date range
  const getFormattedDateRange = () => {
    const { startDate, endDate } = searchParams.dateRange[0];
    if (startDate && endDate) {
      return `${format(startDate, "MM/dd/yyyy")} - ${format(endDate, "MM/dd/yyyy")}`;
    }
    return "";
  };

  // Simple label style - only animates on focus
  const getLabelStyle = (fieldName: string) => {
    const isFocused = focused === fieldName;
    
    return `absolute text-xs font-bold left-4 transition-all ${
      isFocused ? "text-gray-700 text-[10px] top-1" : "text-gray-500 top-2.5"
    }`;
  };

  return (
    <div className="bg-white shadow-2xl rounded-lg w-full max-w-5xl mx-auto filter drop-shadow-2xl">
      <div className="grid grid-cols-6 items-center border border-gray-300 rounded-lg overflow-hidden">
        {/* Date Range Field (Without animation) */}
        <div className="relative px-4 py-3 border-r border-gray-200 col-span-2">
          <div className="text-xs font-bold text-gray-700 mb-1">
            CHECK IN — CHECK OUT
          </div>
          <input
            type="text"
            readOnly
            className="w-full bg-transparent cursor-pointer focus:outline-none"
            onClick={() => setOpenCalendar(true)}
            value={getFormattedDateRange()}
          />
        </div>

        {/* Calendar Dropdown */}
        {openCalendar && (
          <div 
            ref={calendarRef} 
            className="absolute top-full left-0 z-30 mt-2 bg-white shadow-xl rounded-md"
          >
            <DateRange
              editableDateInputs={true}
              onChange={handleDateChange}
              moveRangeOnFirstSelection={false}
              ranges={searchParams.dateRange}
              minDate={new Date()}
            />
          </div>
        )}

        {/* Adults Field - with purely focus-based animation */}
        <div className="relative px-4 py-3 border-r border-gray-200">
          <label className={getLabelStyle("adults")}>
            ADULTS
          </label>
          <input
            type="number"
            min="1"
            value={searchParams.adults}
            className="w-full bg-transparent focus:outline-none pt-4"
            onFocus={() => setFocused("adults")}
            onBlur={() => setFocused("")}
            onChange={(e) => handleInputChange("adults", e.target.value)}
          />
        </div>

        {/* Children Field - with purely focus-based animation */}
        <div className="relative px-4 py-3 border-r border-gray-200">
          <label className={getLabelStyle("children")}>
            CHILDREN
          </label>
          <input
            type="number"
            min="0"
            value={searchParams.children}
            className="w-full bg-transparent focus:outline-none pt-4"
            onFocus={() => setFocused("children")}
            onBlur={() => setFocused("")}
            onChange={(e) => handleInputChange("children", e.target.value)}
          />
        </div>

        {/* Room Type Field - with purely focus-based animation */}
        <div className="relative px-4 py-3 border-r border-gray-200">
          <label className={getLabelStyle("roomType")}>
            ROOM TYPE
          </label>
          <select
            value={searchParams.roomType}
            className="w-full bg-transparent appearance-none focus:outline-none pt-4 pr-8"
            onFocus={() => setFocused("roomType")}
            onBlur={() => setFocused("")}
            onChange={handleRoomTypeChange}
          >
            <option value="">Select type</option>
            <option value="standard">Standard Room</option>
            <option value="deluxe">Deluxe Room</option>
          </select>
          
          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Search Button */}
        <button 
          onClick={handleSearch}
          className="flex items-center justify-center px-6 py-5 bg-[#8B6514] text-white font-semibold cursor-pointer hover:bg-[#A2701A] transition-colors w-full h-full"
          aria-label="Search for rooms"
        >
          <RiSearchLine className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;