![lovestocode](https://raw.githubusercontent.com/loves-to-code/.github/refs/heads/main/assets/loves-to-code-banner.png)

## how to get your own subdomain~

### step 1 - fork this repo (also star 😜 optional)

- fork this repo level: ez pz

### step 2 - add your subdomain file 😜

- create a new `.json` file in the `subdomains` directory and name it after the subdomain you want

- eg: i want `kitty.lovestoco.de` then ill create `subdomains/kitty.json`

### step 3 - fill in the file 😩

- add required details in the following format
```json
{
    "description": "wut you gonna use this for", // dont do scam lil bro
    "subdomain": "kitty", // your subdomain name you want~
    "domain": "lovestoco.de", // required and keep this same as this cuz no other domain available for now
    "owner": {
        "email": "kitty@lovestoco.de", // required required required required
        "github": "kittylovestocode", // required
        "pinterest": "not-required-this-is-just-for-fun", // optional
        "discord": "your.discord.username.optional"
    },
    "record": { // very very very very very required
        "type": "CNAME", // A or CNAME required
        "value": "cname.example-dns.com" // value required 
    }
}
```
### step 4 - pull request !!! 

- create a pull request of the commited files and --

### step 5 - wait

- they dont love you like i love you (read next)

- wait for maintainers to merge your PR and youre all set ~~ we'll handle the rest

- for any issues dm `@snehasish` on discord or find other contact info on [snehasish.xyz](https://snehasish.xyz)
