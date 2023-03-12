import Helpers from "./helpers";

// Make sure only iOS users have the option to secure with Apple
const secureProp =
  Platform.OS === "ios"
    ? [
        ["Enter an Email", "Enter a Password", "Apple"],
        ["email", "password", "apple"],
      ]
    : [
        ["Enter an Email", "Enter a Password"],
        ["email", "password"],
      ];

export default questions = [
  {
    label: secureProp[0],
    stateLabel: secureProp[1],
    isRequired: [true, true],
  },
  {
    label: ["What is your first name?"],
    stateLabel: ["firstName"],
    isRequired: [true],
  },
  {
    isDatePrompt: true,
    label: ["What is your date of birth?"],
    stateLabel: ["dateOfBirth"],
    isRequired: [true],
  },
  {
    hasBothInputTypes: true,
    label: [
      "How do you describe your gender?",
      "Optional: Describe more about your gender here",
    ],
    options: ["Male", "Female", "Intersex"],
    stateLabel: ["gender", "additionalGenderInfo"],
    isRequired: [true, false],
  },
  {
    label: ["What is your sexuality?"],
    options: [
      "Straight",
      "Gay",
      "Lesbian",
      "Bi-sexual",
      "Allosexual",
      "Demisexual",
    ],
    stateLabel: ["sexuality"],
    isRequired: [true],
  },
  {
    label: ["Who are you looking for?"],
    options: ["Men", "Women", "Intersex", "All genders"],
    stateLabel: ["interest"],
    isRequired: [true],
  },
  {
    label: ["How tall are you?"],
    stateLabel: ["height"],
    options: Helpers.returnHeights(),
    isRequired: [true],
  },
  {
    label: ["What's your ethnicity?"],
    options: [
      "Indigenous",
      "Black",
      "East Asian",
      "Hispanic/Latino/LatinX",
      "Middle Eastern",
      "Pacific Islander",
      "South Asian",
      "Southeast Asian",
      "White",
      "Other",
    ],
    stateLabel: ["ethnicity"],
    isRequired: [true],
  },
  {
    label: ["Children?"],
    options: ["Yes", "No", "Want one day", "Don't want"],
    stateLabel: ["children"],
    isRequired: [true],
  },
  {
    label: ["Where's home?"],
    stateLabel: ["home"],
    isRequired: [true],
  },
  {
    label: ["Where do you work?", "What's your job title?"],
    stateLabel: ["jobLocation", "jobTitle"],
    isRequired: [true, true],
  },
  {
    hasBothInputTypes: true,
    label: ["Highest level of education", "Where did you go to school?"],
    options: ["High school", "Undergrad", "Postgrad"],
    stateLabel: ["educationAttained", "school"],
    isRequired: [true, true],
  },
  {
    label: ["What are your religious beliefs?"],
    options: [
      "Agnostic",
      "Atheist",
      "Buddhist",
      "Catholic",
      "Christian",
      "Hindu",
      "Jewish",
      "Muslim",
      "Sikh",
    ],
    stateLabel: ["religiousBelief"],
    isRequired: [true],
  },
  {
    label: ["What are your political beliefs?"],
    options: ["Liberal", "Moderate", "Conservative", "Non political", "Other"],
    stateLabel: ["politicalBelief"],
    isRequired: [true],
  },
  {
    label: ["Do you drink?", "Do you smoke?", "Do you do drugs?"],
    options: ["Yes", "Sometimes", "No"],
    stateLabel: ["drinker", "smoker", "drugUse"],
    isRequired: [true, true, true],
  },
];
