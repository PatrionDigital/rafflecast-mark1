// src/theme/siteTheme.js
export default {
  // Alert
  alert: {
    base: "p-4 pl-12 relative rounded-lg leading-5",
    withClose: "pr-12",
    success: "bg-green-50 text-green-900",
    danger: "bg-red-50 text-red-900",
    warning: "bg-yellow-50 text-yellow-900",
    neutral: "bg-gray-50 text-gray-800",
    info: "bg-blue-50 text-blue-900",
    icon: {
      base: "h-5 w-5",
      success: "text-green-400",
      danger: "text-red-400",
      warning: "text-yellow-400",
      neutral: "text-gray-400",
      info: "text-blue-400",
    },
  },

  // Badge
  badge: {
    base: "inline-flex px-2 text-xs font-medium leading-5 rounded-full",
    success: "text-green-700 bg-green-100",
    danger: "text-red-700 bg-red-100",
    warning: "text-orange-700 bg-orange-100",
    neutral: "text-gray-700 bg-gray-100",
    primary: "text-cochineal-red bg-pastel-rose",
  },

  // Button
  button: {
    base: "align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none",
    block: "w-full",
    size: {
      larger: "px-10 py-4 rounded-lg",
      large: "px-5 py-3 rounded-lg",
      regular: "px-4 py-2 rounded-lg text-sm",
      small: "px-3 py-1 rounded-md text-sm",
      icon: {
        larger: "p-4 rounded-lg",
        large: "p-3 rounded-lg",
        regular: "p-2 rounded-lg",
        small: "p-2 rounded-md",
      },
      pagination: "px-3 py-1 rounded-md text-xs",
    },
    // styles applied to the SVG icon
    icon: {
      larger: "h-5 w-5",
      large: "h-5 w-5",
      regular: "h-5 w-5",
      small: "h-3 w-3",
      left: "mr-2 -ml-1",
      right: "ml-2 -mr-1",
    },
    primary: {
      base: "text-white bg-cochineal-red border border-transparent",
      active:
        "active:bg-enamel-red hover:bg-enamel-red focus:ring focus:ring-cochineal-red",
      disabled: "opacity-50 cursor-not-allowed",
    },
    outline: {
      base: "text-cochineal-red border-cochineal-red border",
      active:
        "active:bg-transparent hover:border-enamel-red focus:border-enamel-red active:text-enamel-red focus:ring focus:ring-cochineal-red",
      disabled: "opacity-50 cursor-not-allowed bg-gray-300",
    },
    link: {
      base: "text-cochineal-red focus:outline-none border border-transparent",
      active:
        "active:bg-transparent hover:bg-pastel-rose focus:ring focus:ring-cochineal-red",
      disabled: "opacity-50 cursor-not-allowed",
    },
    // this is the button that lives inside the DropdownItem
    dropdownItem: {
      base: "inline-flex items-center cursor-pointer w-full px-2 py-1 text-sm font-medium transition-colors duration-150 rounded-md hover:bg-asphalt hover:text-white",
    },
  },

  // Card
  card: {
    base: "min-w-0 rounded-lg overflow-hidden border border-enamel-red border-opacity-20",
    default: "bg-asphalt/70 text-cement",
  },
  cardBody: {
    base: "p-4",
  },

  // Dropdown
  dropdown: {
    base: "absolute w-56 p-2 mt-2 text-cement bg-asphalt border border-enamel-red border-opacity-20 rounded-lg shadow-md min-w-max-content",
    align: {
      left: "left-0",
      right: "right-0",
    },
  },

  // Input
  input: {
    base: "block w-full text-sm focus:outline-none leading-5 rounded-md",
    active:
      "focus:border-cochineal-red border-gray-600 focus:ring focus:ring-cochineal-red bg-asphalt text-cement",
    disabled: "cursor-not-allowed opacity-50 bg-gray-300",
    valid:
      "border-green-600 focus:border-green-400 focus:ring focus:ring-green-200",
    invalid:
      "border-red-600 focus:border-red-400 focus:ring focus:ring-red-200",
    radio:
      "text-cochineal-red form-radio focus:border-cochineal-red focus:outline-none focus:ring focus:ring-cochineal-red focus:ring-offset-0",
    checkbox:
      "text-cochineal-red form-checkbox focus:border-cochineal-red focus:outline-none focus:ring focus:ring-cochineal-red focus:ring-offset-0 rounded",
  },

  // Label
  label: {
    base: "block text-sm text-cement",
    check: "inline-flex items-center",
    disabled: "opacity-50 cursor-not-allowed",
  },

  // Modal
  modal: {
    base: "w-full px-6 py-4 overflow-hidden bg-asphalt rounded-t-lg sm:rounded-lg sm:m-4 sm:max-w-xl border border-enamel-red border-opacity-20",
  },
  modalBody: {
    base: "mb-6 text-sm text-cement",
  },
  modalFooter: {
    base: "flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-4 sm:space-y-0 sm:space-x-6 sm:flex-row bg-black",
  },
  modalHeader: {
    base: "mt-4 mb-2 text-lg font-semibold text-cochineal-red",
  },

  // Select
  select: {
    base: "block w-full text-sm focus:outline-none rounded-md",
    active:
      "focus:border-cochineal-red border-gray-600 focus:ring focus:ring-cochineal-red bg-asphalt text-cement",
    disabled: "cursor-not-allowed opacity-50 bg-gray-300",
    valid:
      "border-green-600 focus:border-green-400 focus:ring focus:ring-green-200",
    invalid:
      "border-red-600 focus:border-red-400 focus:ring focus:ring-red-200",
  },

  // Table
  table: {
    base: "w-full whitespace-no-wrap",
  },
  tableContainer: {
    base: "w-full overflow-hidden rounded-lg border border-enamel-red border-opacity-20",
  },
  tableHeader: {
    base: "text-xs font-semibold tracking-wide text-left text-cement uppercase border-b border-enamel-red border-opacity-20 bg-asphalt",
  },
  tableBody: {
    base: "bg-black divide-y divide-enamel-red divide-opacity-20 text-cement",
  },
  tableCell: {
    base: "px-4 py-3 text-cement",
  },

  // Textarea
  textarea: {
    base: "block w-full text-sm rounded-md focus:outline-none",
    active:
      "focus:border-cochineal-red border-gray-600 focus:ring focus:ring-cochineal-red bg-asphalt text-cement",
    disabled: "cursor-not-allowed opacity-50 bg-gray-300",
    valid:
      "border-green-600 focus:border-green-400 focus:ring focus:ring-green-200",
    invalid:
      "border-red-600 focus:border-red-400 focus:ring focus:ring-red-200",
  },

  // HelperText
  helperText: {
    base: "text-xs",
    valid: "text-green-600",
    invalid: "text-red-600",
  },
};
