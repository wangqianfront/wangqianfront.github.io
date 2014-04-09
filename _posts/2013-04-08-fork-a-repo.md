---
layout: post
category : github
title:  Fork A Repo
header: Fork A Repo
tagline:
tags : [github]
---
{% include JB/setup %}
#### 如果你想贡献某个项目，我们知道在github里有个'folking'。在这篇文章里，我们以托管在GitHub.com上___Spoon-Knife___项目为例。

1. **第一步: Fork the `Spoon-Knife` repository**

	![Fork](https://github-images.s3.amazonaws.com/help/bootcamp/Bootcamp-Fork.png)
	
2. **第二步: Clone your fork**

Run the following code:

	
	$ git clone https://github.com/username/Spoon-Knife.git
	\# Clones your fork of the repository into the current directory in terminal
	

3. **第三步: Configure remotes**

When a repository is cloned, it has a default remote called `origin` that points to your fork on GitHub, not the original repository it was forked from. To keep track of the original repository, you need to add another remote named `upstream`:
	
	
	$ cd Spoon-Knife
	\# Changes the active directory in the prompt to the newly cloned "Spoon-Knife" directory
	$ git remote add upstream https://github.com/octocat/Spoon-Knife.git
	\# Assigns the original repository to a remote called "upstream"
	$ git fetch upstream
	\# Pulls in changes not present in your local repository, without modifying your files
	

#### 想做得更多？

**Push commits**

	
	$ git push origin master
	\# Pushes commits to your remote repository stored on GitHub
	

**Pull in upstream changes**

如果你folk的项目有更新，你想将这些更新在你folk的库里

	
	$ git fetch upstream
	\# Fetches any new changes from the original repository
	$ git merge upstream/master
	\# Merges any changes fetched into your working files
	

**Create branches**

	
	$ git branch mybranch
	\# Creates a new branch called "mybranch"
	$ git checkout mybranch
	\# Makes "mybranch" the active branch
	

To switch between branches, use git checkout.

	
	$ git checkout master
	\# Makes "master" the active branch
	$ git checkout mybranch
	\# Makes "mybranch" the active branch
	

Once you're finished working on your branch and are ready to combine it back into the master branch, use merge
	
	
	$ git checkout master
	\# Makes "master" the active branch
	$ git merge mybranch
	\# Merges the commits from "mybranch" into "master"
	$ git branch -d mybranch
	\# Deletes the "mybranch" branch
	
