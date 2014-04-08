package com.statestr.cloud.servlet;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FilenameUtils;
import org.apache.log4j.Logger;

import com.statestr.cloud.util.StringUtil;

@SuppressWarnings("serial")
public class UploadToolServlet extends HttpServlet
{
    private static Logger logger = Logger.getLogger(UploadToolServlet.class);
    private static String strTargetFolder = "";

    static
    {
	String reportPath = UploadToolServlet.class.getClass().getClassLoader().getResource("/").getPath();
	try
	{
	    reportPath = URLDecoder.decode(reportPath, "UTF-8");
	}
	catch (UnsupportedEncodingException e)
	{
	    logger.error(e);
	}

	File path = new File(reportPath);
	strTargetFolder = reportPath.substring(0, reportPath.lastIndexOf("class"));
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
	String userId = req.getParameter("userId");
	req.setCharacterEncoding("utf-8");
	resp.setContentType("text/html; charset=utf-8");

	String errorMessageWhenWriteToDB = "";
	boolean isMultipart = ServletFileUpload.isMultipartContent(req);
	if (isMultipart)
	{
	    FileItemFactory factory = new DiskFileItemFactory();
	    ServletFileUpload upload = new ServletFileUpload(factory);
	    try
	    {
		List items = upload.parseRequest(req);
		Iterator iter = items.iterator();
		while (iter.hasNext())
		{
		    FileItem item = (FileItem) iter.next();
		    if (!item.isFormField())
		    {
			String fileName = item.getName();
			String newFileName = "";
			int index = -1;
			if (!StringUtil.isNullOrEmpty(fileName))
			{
			    fileName = FilenameUtils.getName(fileName);
			    index = fileName.lastIndexOf(".");
			    if (index > 0)
			    {
				newFileName = strTargetFolder + fileName.substring(0, index) + "_" + userId + "_"
					+ StringUtil.generateFileID() + fileName.substring(index);
				logger.info("The newFile path is :" + newFileName);
			    }
			    File uploadedFile = new File(newFileName);

			    try
			    {
				item.write(uploadedFile);
			    }
			    catch (Exception e)
			    {
				e.printStackTrace();
			    }

			    logger.info("**************before writeMacroFileToDB*********");
			    String[] strArray = new String[45];
			    // writeMacroFileToDB(newFileName);
			    logger.info("**************after writeMacroFileToDB**********");
			    if (2 == strArray.length)
			    {
				String message = strArray[0];
				String errorMessage = strArray[1];
				if (errorMessage.equals(""))
				{
				    resp.getWriter().println(
					    "{\"flag\":\"ok\", \"message\": \"" + message + "\", \"success\": true }");
				}
				else
				{
				    resp.getWriter().println(
					    "{\"flag\":\"error\", \"message\": \"" + errorMessage + "\", \"success\": true }");
				}
			    }
			}
		    }

		}
	    }
	    catch (FileUploadException e)
	    {
		logger.error(e.getMessage());
		errorMessageWhenWriteToDB = e.getMessage();
		resp.getWriter().println(
			"{\"flag\":\"error\", \"message\": \"" + errorMessageWhenWriteToDB + "\", \"success\": true }");
	    }
	    catch (Exception ex)
	    {
		logger.error(ex.getMessage(), ex);
		errorMessageWhenWriteToDB = ex.getMessage();
		resp.getWriter().println(
			"{\"flag\":\"error\", \"message\": \"" + errorMessageWhenWriteToDB + "\", \"success\": true }");
	    }
	}
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
	doGet(req, resp);
    }
}
