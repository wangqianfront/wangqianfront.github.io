package com.statestr.cloud.tool;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

/**
 * @author e525744
 * @date Nov.14 2012
 * @deprecation this tool is used to prepare Peformance Test data.
 */
public class PrepareFeedDataTool
{

    private static Logger logger = Logger.getLogger(PrepareFeedDataTool.class);

    private final static Map<String, String> map = System.getenv();
    private final static String lanID = map.get("USERNAME");
    private final static String storeFeedPath = "C:/Documents and Settings/" + lanID + "/Desktop/data/";

    public PrepareFeedDataTool()
    {
	File file = new File(storeFeedPath);
	if (!file.exists())
	    file.mkdir();
    }

    private String getFeed(int IDF)
    {
	StringBuffer buffer = new StringBuffer();
	buffer.append(storeFeedPath).append(IDF).append(".feed");
	return buffer.toString();
    }

    private boolean isFileExists(int IDF)
    {
	String pathname = getFeed(IDF);
	File file = new File(pathname);
	return file.exists();
    }

    private String formatString(String content)
    {
	String regex = "\t|\r|\n";
	return content.replaceAll(regex, "");
    }

    public String ExportFeed(int _IDF, HashMap<String, String[]> _inputs)
    {
	StringBuffer keys = new StringBuffer();
	StringBuffer values = new StringBuffer();
	if (_inputs != null)
	{
	    for (String key : _inputs.keySet())
	    {
		keys.append("{").append(key).append("}");
		if (key.equalsIgnoreCase("null"))
		    continue;
		values.append("{").append(_inputs.get(key)[0]).append("}");
	    }
	}

	StringBuffer content = new StringBuffer();
	boolean flag = isFileExists(_IDF);
	if (!flag)
	    content.append(keys).append("\n");
	content.append(formatString(values.toString()));
	logger.info("-----  begin to handle " + _IDF + "  ------");
	boolean result = updateContentToFeed(content.toString(), _IDF, flag);
	return result == true ? "Success Export !" : "Fail to export !";
    }

    private boolean updateContentToFeed(String content, int IDF, boolean flag)
    {
	String pathname = getFeed(IDF);
	File file = new File(pathname);
	FileWriter fw = null;
	boolean isSuccessUpdate = true;
	if (flag)
	{
	    StringBuffer buffer = new StringBuffer();
	    buffer.append("\n").append(content);
	    try
	    {
		fw = new FileWriter(file, true);
		fw.write(buffer.toString());
	    }
	    catch (Exception e)
	    {
		logger.error(e.getMessage(), e);
		isSuccessUpdate = false;
	    }
	    finally
	    {
		try
		{
		    fw.close();
		}
		catch (IOException e)
		{
		    isSuccessUpdate = false;
		    logger.error(e.getMessage(), e);
		}
		logger.info(pathname + " was alread existed and new contents had been added!");
	    }
	}
	else
	{

	    try
	    {
		fw = new FileWriter(file);
		fw.write(content, 0, content.length());
		fw.flush();
	    }
	    catch (Exception e)
	    {
		logger.error(e.getMessage(), e);
		isSuccessUpdate = false;
	    }
	    finally
	    {
		try
		{
		    fw.close();
		}
		catch (IOException e)
		{
		    isSuccessUpdate = false;
		    logger.error(e.getMessage(), e);
		}
		logger.info(pathname + " has been created !");
	    }
	}
	return isSuccessUpdate;
    }

    public static void main(String[] args)
    {
	PrepareFeedDataTool tool = new PrepareFeedDataTool();
	System.out.println(tool.isFileExists(910010001));
    }
}
