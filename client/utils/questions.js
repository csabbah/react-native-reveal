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
  },
  { label: ["What is your first name?"], stateLabel: ["firstName"] },
  {
    isDatePrompt: true,
    label: ["What is your date of birth?"],
    stateLabel: ["dateOfBirth"],
  },
  {
    hasBothInputTypes: true,
    label: [
      "How do you describe your gender?",
      "Optional: Describe more about your gender here",
    ],
    options: ["Male", "Female", "Intersex"],
    stateLabel: ["gender", "additionalGenderInfo"],
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
  },
  {
    label: ["Who are you looking for?"],
    options: ["Men", "Women", "Intersex", "All genders"],
    stateLabel: ["interest"],
  },
  {
    label: ["How tall are you?"],
    stateLabel: ["height"],
    options: Helpers.returnHeights(),
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
  },
  {
    label: ["Children?"],
    options: ["Yes", "No", "Want one day", "Don't want"],
    stateLabel: ["children"],
  },
  {
    label: ["Where's home?"],
    stateLabel: ["home"],
  },
  {
    label: ["Where do you work?", "What's your job title?"],
    stateLabel: ["jobLocation", "jobTitle"],
  },
  {
    hasBothInputTypes: true,
    label: ["Highest level of education", "Where did you go to school?"],
    options: ["High school", "Undergrad", "Postgrad"],
    stateLabel: ["educationAttained", "school"],
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
  },
  {
    label: ["What are your political beliefs?"],
    options: ["Liberal", "Moderate", "Conservative", "Non political", "Other"],
    stateLabel: ["politicalBelief"],
  },
  {
    label: ["Do you drink?", "Do you smoke?", "Do you do drugs?"],
    options: ["Yes", "Sometimes", "No"],
    stateLabel: ["drinker", "smoker", "drugUse"],
  },
];
