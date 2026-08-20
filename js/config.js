/*
  CONFIG — the only file you need to touch after your friend has her own Google Sheet.

  HOW TO GET THE TWO LINKS BELOW (one-time, ~1 minute each, no coding):
    1. Open the Google Sheet in a browser (Job Openings sheet first).
    2. File -> Share -> Publish to web.
    3. In the first dropdown choose the specific sheet/tab (not "Entire document")
       if it's a multi-tab spreadsheet. In the second dropdown choose "Comma-separated values (.csv)".
    4. Click "Publish", confirm, then copy the link it gives you.
    5. Paste that link as JOBS_CSV_URL below.
    6. Repeat for the profile/contact sheet -> paste as PROFILE_CSV_URL below.

  Whenever she edits and saves the sheet, the published CSV updates automatically
  within a minute or two -- nobody needs to touch the website again.

  Until you paste real links, the site falls back to the sample data in /data
  so you can preview it locally right now.
*/

const CONFIG = {
  JOBS_CSV_URL: "https://docs.google.com/spreadsheets/d/1r-dur5Ndz7CXm41aB__lIAcuJcrQniRHPjK6OqSfysA/edit?gid=2101256547#gid=2101256547",    // <-- paste the published "Job Openings" CSV link here
  PROFILE_CSV_URL: "https://docs.google.com/spreadsheets/d/1r-dur5Ndz7CXm41aB__lIAcuJcrQniRHPjK6OqSfysA/edit?gid=1893347345#gid=1893347345", // <-- paste the published "Recruiter Profile" CSV link here

  // Local fallback data, used only when the URLs above are empty (for local preview/testing).
  FALLBACK_JOBS_CSV: "data/sample-jobs.csv",
  FALLBACK_PROFILE_CSV: "data/sample-profile.csv",

  SITE_TITLE: "Startup Jobs Board",
};
