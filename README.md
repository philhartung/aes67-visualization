# aes67-visualization
Command line tool to easily launch ffmpeg audio visualizations from AES67 sdp files

## Installation
```
git clone https://github.com/philhartung/aes67-visualization.git
cd aes67-visualization
npm install
```
In addition to that, both [gstreamer](https://gstreamer.freedesktop.org/documentation/installing/index.html) and [ffmpeg](https://ffmpeg.org/) need to be installed. 

## Usage
To display the help, execute `node main --help`:
```
Usage: main [options]

Options:
  -V, --version      output the version number
  -f, --file <file>  Input sdp file
  -t, --type <type>  Visualtization type: ebur, spectrum, ahistogram, avectorscope, showcqt, showfreqs, showspatial, abitscope, showwaves, aphasemeter,
                     showvolume
  -h, --help         display help for command
```
