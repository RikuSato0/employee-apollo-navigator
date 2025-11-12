
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// List of all countries based on the provided images
const allCountries = [
  "Åland Islands", "Afghanistan", "Akrotiri", "Albania", "Algeria", "American Samoa",
  "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina",
  "Armenia", "Aruba", "Ashmore and Cartier Islands", "Australia", "Austria", "Azerbaijan",
  "Bahrain", "Bangladesh", "Barbados", "Bassas Da India", "Belarus", "Belgium",
  "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
  "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "British Virgin Islands", "Brunei",
  "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon",
  "Canada", "Cape Verde", "Caribbean Netherlands", "Cayman Islands", "Central African Republic", "Chad",
  "Chile", "China", "Christmas Island", "Clipperton Island", "Cocos (Keeling) Islands", "Colombia",
  "Comoros", "Cook Islands", "Coral Sea Islands", "Costa Rica", "Cote D'Ivoire", "Croatia",
  "Cuba", "Curaçao", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark",
  "Dhekelia", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Europa Island",
  "Falkland Islands (Islas Malvinas)", "Faroe Islands", "Federated States of Micronesia", "Fiji", "Finland", "France",
  "French Guiana", "French Polynesia", "French Southern and Antarctic Lands", "Gabon", "Gaza Strip", "Georgia",
  "Germany", "Ghana", "Gibraltar", "Glorioso Islands", "Greece", "Greenland",
  "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea",
  "Guinea-bissau", "Guyana", "Haiti", "Heard Island and Mcdonald Islands", "Holy See (Vatican City)", "Honduras",
  "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran",
  "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica",
  "Jan Mayen", "Japan", "Jersey", "Jordan", "Juan De Nova Island", "Kazakhstan",
  "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos",
  "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique",
  "Mauritania", "Mauritius", "Mayotte", "Mexico", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia",
  "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua",
  "Niger", "Nigeria", "Niue", "Norfolk Island", "North Korea", "Northern Mariana Islands",
  "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
  "Papua New Guinea", "Paracel Islands", "Paraguay", "Peru", "Philippines", "Pitcairn Islands",
  "Poland", "Portugal", "Puerto Rico", "Qatar", "Republic of the Congo", "Reunion",
  "Romania", "Russia", "Rwanda", "Saint Barthélemy", "Saint Helena", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Martin", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
  "Singapore", "Sint Maarten", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Georgia and the South Sandwich Islands", "South Korea", "South Sudan", "Spain", "Spratly Islands",
  "Sri Lanka", "Sudan", "Suriname", "Svalbard", "Swaziland", "Sweden",
  "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
  "The Bahamas", "The Gambia", "Timor-leste", "Togo", "Tokelau", "Tonga",
  "Trinidad and Tobago", "Tromelin Island", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands",
  "Wake Island", "Wallis and Futuna", "West Bank", "Western Sahara", "Yemen", "Zambia",
  "Zimbabwe"
];

interface CountriesSelectProps {
  selectedCountries: string[];
  onSelectionChange: (countries: string[]) => void;
}

const CountriesSelect: React.FC<CountriesSelectProps> = ({ 
  selectedCountries, 
  onSelectionChange 
}) => {
  const [filter, setFilter] = useState("");

  const filteredCountries = filter 
    ? allCountries.filter(country => country.toLowerCase().includes(filter.toLowerCase())) 
    : allCountries;

  const handleCountryToggle = (country: string) => {
    if (selectedCountries.includes(country)) {
      onSelectionChange(selectedCountries.filter(c => c !== country));
    } else {
      onSelectionChange([...selectedCountries, country]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="country-search">Search Countries</Label>
        <span className="text-sm text-muted-foreground">
          {selectedCountries.length} selected
        </span>
      </div>
      <input
        id="country-search"
        className="w-full px-3 py-2 border rounded-md"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Search countries..."
      />
      <ScrollArea className="h-[240px] border rounded-md p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredCountries.map((country) => (
            <div key={country} className="flex items-center space-x-2">
              <Checkbox 
                id={`country-${country}`}
                checked={selectedCountries.includes(country)}
                onCheckedChange={() => handleCountryToggle(country)}
              />
              <Label 
                htmlFor={`country-${country}`}
                className="text-sm cursor-pointer"
              >
                {country}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CountriesSelect;
