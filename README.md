
# Envo – AI photo editor
I started this project in 2022 to put my **React** skills to work and play with AI. Theese are actually 2 apps. One is **Node.js** App - it renders UI with React and JavaScript, and manages database on server side. Second app is written in **Python** and it performs all the AI processing. It loads and runs Neural Network models with **Keras and Tensorflow**. It is also a simple web server with REST API for uploading images and returning AI processing results to Node.js App. Making those two apps work smoothly in production environment was quite a challenge :)

![screen_03](https://github.com/zbigniew54/envo/assets/132487185/5ca96465-813c-41d7-8806-9dac8f53e24c)

_Red areas mark "background" detected by AI_

# Live demo
* https://envo.fly.dev
* user: test15@envo.pro 
* pass: y|,;|n/qNge_>D|W

![screen_01](https://github.com/zbigniew54/envo/assets/132487185/c36036b0-0ba8-416e-bd7a-58508fd0ee9d)

# How it works
When user uploads an image it is sent to **Python App** which runs AI processing on it. The most important task is semantic segmentation. The AI is trained to recognise faces, hair, eyes on photograph, and it also separates whole person from background. It takes about 2-3 sec to perform that and return images with segmentation masks to **Node.js App**. 

![screen_02](https://github.com/zbigniew54/envo/assets/132487185/7b43257e-7ad2-4ee1-9e66-b8a32675acd3)

_Red areas were recognised by AI as "face". You can click "Face" in "Layers" widget to select this layers and apply filters only for masked pixels_

You may select and edit each recognised part with „Layers” widget. The App lets you edit dozens of filters for each layer. Every time you change any filter setttings it is **automatically saved to database**. If you make many changes during short amount of time (less than 3 seconds) only one request to server is made (with the latest filter settings). This "buffering" is done so users won't flood server with requests while rolling mouse wheel over slider or something like that.

You can also see **live** preview whenever you change any filter setting (without necessity of undoing ane previous filters modifications like in most layer based editors). This JavaScript app does it in real time even for high resolution images because it uses GPU acceleration! In fact all the rendering is done with **WebGL** and the filters are implemented as **GLSL shaders** (fragment and vertex programs).

![screen_04](https://github.com/zbigniew54/envo/assets/132487185/322c4078-f0e1-48b1-8062-ee7e30821289)


The „AI” used in this app is a „u-net” type architecture with some custom modifications I made. It took a me a few months of training, testing and research to make it work efficiently but I am quite satisfied with results. It has **18 millions parameters** ("neurons") and creates **512x512 masks** for face, hair and background simultaneously. Moreover **each mask is 8 bit** while most segmentation models output only 1 bit masks marking each pixel as either positive or negative. This creates ugly aliased edges and it can't handle transparent objects (ie hair). This is why I needed a custom model.

I implemented it from scratch in Python (with Keras/Tensorflow) and trained it on a dataset of **3500 images** I prepared mostly myself. I took about 500 of those phograps myself. Other images come from public datasets for which I made segmentation masks. It was a lot of work but to finish it faster I used my older segmentation model that made coarse masks and I only had to manually correct its errors. 

![AI generated masks example](https://github.com/zbigniew54/envo/assets/132487185/de70fe46-bf00-4339-917a-21b90dc31340)

_Example of masks generated for image from Celeb HQ dataset_

# Features
*	**Auto masking** – AI performs segmentation of an image detecting: faces, hair, eyes, teeth and background.
*	**Editing many aspects of an image**: exposure, contrast, brightness (whites/blacks, hilights/shadows), saturation etc
* **Realtime rendering with WebGL** – this allows for dynamic editing with many filters
*	**Simple image management**: uploading, deleting, rating, renaming etc

# Future work:
*	Current neural network has medium accuracy. It often makes mistakes. Especiallny person/background segmentation is a difficult topic. Right now I finish training better network for this task and I will upload It soon.

* While AI processing is quite fast (2-3 sec per image with any resolution) it may suffer from **„cold start”**. The Python App is not always online. After about 1 minute of inactivity it „goes asleep”. When It is woken up it must load neural network models from disk and initialize them. It takes up to 30 seconds. It is actually a hosting limitation. One day I may buy more expensive one to solve this issue. Anyway if you open image for edit right after it uploads you may see „AI processing” message (where „Layers” whould be). There is no live reload after AI stops processing segmentation mask at the moment so you have to go back to „Browse” and open image again to see AI-detected masks. 

* More filters and image effects. This app has only basic functionality right now. I plan to add more useful things like white balance adjustments, lens blur effect, noise removal etc

*	Since this app is designed for photographers it will support HDR images. Popular JPEGs are 8bit and it is enough for screen display. However it is not enough for photography editing. That is why all profesional cameras can save images in so called RAW format (each producer has his own format but they are mostly TIFF based). These file formats have 12-14-bit per color channel which gives a lot editing posibilities. This future is almost done and I hope to upload it soon.
