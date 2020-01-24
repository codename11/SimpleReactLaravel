# Video Media Player / Home theater

## Getting Started:
Put this into root of your server. I used xammp, but there is no trouble to make it work with lamp stack.

## Prerequisites:
You'll need a xampp installation, composer installed and nmp package manager. 
To disable exploitation and to emulate live conditions go to `c:\windows\system32\drivers\etc `
and modify file named hosts. In it add following lines (at the bottom):

1. 127.0.0.1 localhost 
2. 127.0.0.1 reactapp.test
First means it's going to be served locally and second is name of project.

Second(server configuration), go to `c:\xampp\apache\conf\extra\` and open httpd-vhosts file.
In it, at the bottom, add these lines:

1. 
```
<VirtualHost *:80>

    DocumentRoot "C:/xampp/htdocs"
    ServerName localhost
    
</VirtualHost>
```
2. and 
```
<VirtualHost *:80>

    DocumentRoot "C:/xampp/htdocs/reactapp/public"
    ServerName reactapp.test
    
</VirtualHost>
```

For instructions for using React in Laravel(alongside with Ajax) use this [resource](https://www.freecodecamp.org/forum/t/how-to-manual-for-react-in-laravel-an-upgrade-with-ajax/314297).

No third party libraries have been used.

## Installing:

Install(in this order):

1. xampp(server environment)
2. composer(Laravel package manger)
3. gitbash(for running terminal)
4. npm(node package manager which can also been used for React and sass)
5. Run xampp, both apache and mysql
6. Create db named `reactapp`
7. In .env file set these variables
```
DB_DATABASE=reactapp
DB_USERNAME=root
DB_PASSWORD=""
```
8. Run migrations
9. Change to gitbash as default terminal
10. In terminal, type: `npm run watch` to compile React and sass files.
11. If you done all correctly, type in browser `reactapp.test`.

## Usage:

After starting application, you'll be presented with this image:
![Welcome screen](1.png)

You either sign in or register if not done so. You may even chose avatar.

After login, you'll see dashboard where you can see your user name, current temperature at your location and upload button which will lead you to upload page. As seen in this image:
![Upload screen](2.png)

After login, you're presented to either see the list of all videos or upload yours.
If you choose to upload yours, you'll bee see this image if you chose option to create videos from menu:
![Upload screen](3.png)

You must chose title, description and thumbnail for your video.

If you chose to list video, you'll be presented list of six video per page row. If you want to see more of them(if any), click `Show more` text to load more(if any).
![List videos](4.png)

**Updated**

Added delete and update and subtitle option.

To delete just press red delete button, after whom, modal will pop out with confirmation window.
![Delete video](6.png)

Similar is for update. Except you can update title, description and choose another thumbnail.
![Update video](5.png)

To choose different subtitle, click on select-option dropdown.
![Choose subtitle](7.png)
By default, no subtitle is chosen.

## Update1:

Added subtitle editing option. One new option called "Modify subtitle" in navbar is presented.

![Edit subtitle](8.png)

After clicking on selected menu item, you'll be presented an select-option dropdown. From it you'll have to chose video for which you'll later edit subtitle.

On this image, you are presented a list of possible videos to chose from.

![Choose video](9.png)

After selecting desired one, you'll be getting another, just bellow, select option.

![Choose subtitle](10.png)

From which you choose particular subtitle to edit.

In this image, you are seeing text of subtitle itself. By editing and subsequently submiting changes, you're modifying said subtitle file.

![Modify subtitle](11.png)

## Update2:

Added control panel for adminstrator to assign privileges to particular users.
Row painted reddish is current user, which subsequently must have role of `administrator` to assign roles. 

![Dashboard table](12.png)

By clicking on particular row, you'll be asked to assign role to chosen user. User's previous role will be marked by checked radio button.

![Checked user's role](13.png)

By checking other radio button and submitting, user's role has been changed.

Filtering by genre is also added. Need to add functionlity to administrator so he can add additional genres.

![Filtering](14.png)

## Technologies used:

1. React
2. Ajax
3. Laravel
4. Javascript
5. Sass
6. Css
7. Html

### My email:
veljkos82@gmail.com



