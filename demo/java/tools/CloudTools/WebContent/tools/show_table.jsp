<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Find Table Tool</title>
<link rel="stylesheet" type="text/css" href="../css/style.css" />
<script src="../js/browseFolder.js"></script>

</head>
<body>
	<div id="tool">
		<form action="/findTable" method="post">
		选择数据库脚本目录路径:
			<input type="text" name="path" /> <input type="submit"
				value="查找表" />
				<br/>
				<p>for example: I have a cloud project named EPAM, the SQL_Script is in C:\workspace\EPAM\sql_scripts in my local, so I input this path in input</p>
		</form>
	</div>
</body>
</html>