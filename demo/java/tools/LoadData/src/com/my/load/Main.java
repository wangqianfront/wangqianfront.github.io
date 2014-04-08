package com.my.load;

import java.sql.Connection;
import java.util.Properties;

import com.my.load.data.LoadDataConstanse;

public class Main
{
    public static void main(String[] args)
    {
	try
	{
	    System.out.println("********* begin ***********");
	    Properties pros = LoadDataService.loadPropertes();
	    Connection conn = LoadDataService.getConnection();
	    LoadDataService service = new LoadDataService();
	    service.init(pros);
	    boolean isCreate = Boolean.valueOf(pros.getProperty(LoadDataConstanse.LOAD_CREATE_SQL));
	    if (isCreate)
	    {
		service.createSQL("tablelist.xml", pros, conn);
	    }
	    isCreate = Boolean.valueOf(pros.getProperty(LoadDataConstanse.LOAD_CREATE_XML));
	    if (true)
	    {
		service.createXml("tablelist.xml", pros, conn);
	    }
//	    LoadDataService.executeSQL(conn, "tablelist.xml");
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	System.out.println("*********** end ***********");
    }
}
