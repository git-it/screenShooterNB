import os
from glob import glob

from setuptools import find_packages, setup

setup(
    name='screen_shooter_nbextension',
    version='0.1dev',
    license='Creative Commons Attribution-Noncommercial-Share Alike license',
    long_description="Adds the ability to easily take screenshots and save them into the notebook.",
    author='mstern',
    
    packages=['screenshooter',],
    install_requires=[
        'jupyter_core',
        'notebook >=4.0',
    ],
    # jupyter server
    zip_safe=False,
    include_package_data=True,
    data_files=[
        # like `jupyter nbextension install --sys-prefix`
        ("share/jupyter/nbextensions/screenshooter", [
            "screenshooter/static/index.js",
        ]),
        # like `jupyter nbextension enable --sys-prefix`
        ("etc/jupyter/nbconfig/notebook.d", [
            "jupyter-config/nbconfig/notebook.d/screenshooter.json"
        ]),
        # like `jupyter serverextension enable --sys-prefix`
        ("etc/jupyter/jupyter_notebook_config.d", [
            "jupyter-config/jupyter_notebook_config.d/screenshooter.json"
        ])
    ]
)


if __name__ == '__main__':
    main()
