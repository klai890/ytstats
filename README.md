# ytstats
Some simple graphs to visualize YouTube data.

## Setup
1. Clone the repository
```
git clone https://github.com/klai890/ytstats.git
```

2. Download your YouTube data from Google (as a JSON file)
By following the instructions at [Google Takeout](https://support.google.com/accounts/answer/3024190?hl=en), for YouTube videos. Export it as a **JSON** file, and move `watch-history.json` to the project's root directory.

3. Run `data_parsing.py`
This creates `day_ct.json`, `month_ct.json`, `month_year_ct.json`, which are used to generate the graphs.

4. Run the project
```
cd nextjsproj && npm run dev
```

Happy graph viewing!
