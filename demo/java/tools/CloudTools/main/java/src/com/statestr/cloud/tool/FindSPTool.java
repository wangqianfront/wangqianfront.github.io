package com.statestr.cloud.tool;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FindSPTool
{
    public static void getTables(String fileName) throws IOException
    {
	Map<String, String> map = new HashMap<String, String>();
	File file = new File(fileName);
	BufferedReader br = new BufferedReader(new FileReader(file));
	String readLine = "";
	int index = 0;

	while ((readLine = br.readLine()) != null)
	{
	    if (readLine.isEmpty())
		continue;

	    if (readLine.toUpperCase().contains("SELECT"))
	    {
		String fromPattern = "FROM(\\s+)(\\w+)";
		Pattern pattern = Pattern.compile(fromPattern);
		Matcher matcher = pattern.matcher(readLine.toUpperCase());
		if (matcher.find())
		{
		    String table = matcher.group(2);
		    if (table.trim().toUpperCase().equals("DUAL"))
			continue;
		    map.put(table, table);
		    index++;
		}
	    }

	    if (readLine.toUpperCase().contains("UPDATE"))
	    {
		String fromPattern = "UPDATE(\\s+)(\\w+)";
		Pattern pattern = Pattern.compile(fromPattern);
		Matcher matcher = pattern.matcher(readLine.toUpperCase());
		if (matcher.find())
		{
		    String table = matcher.group(1);
		    map.put(table, table);
		    index++;
		}
	    }

	    if (readLine.toUpperCase().contains("DELETE"))
	    {
		String fromPattern = "FROM(\\s+)(\\w+)";
		Pattern pattern = Pattern.compile(fromPattern);
		Matcher matcher = pattern.matcher(readLine.toUpperCase());
		if (matcher.find())
		{
		    String table = matcher.group(1);
		    if (table.trim().toUpperCase().equals("DUAL"))
			continue;
		    map.put(table, table);
		    index++;
		}
	    }
	}

	BufferedWriter bw = new BufferedWriter(new FileWriter(new File("src/com/ywl/test/tables/tables.name")));
	Set<Entry<String, String>> set = map.entrySet();
	Iterator<Entry<String, String>> it = set.iterator();
	while (it.hasNext())
	{
	    Entry<String, String> entry = it.next();
	    if (entry.getValue().trim().isEmpty())
		continue;
	    if (entry.getKey().equals(""))
		continue;
	    bw.write(entry.getKey() + "\n");
	    System.out.println(entry.getKey());
	}
	bw.close();
	System.out.println("there are " + index + " tables.....");
    }

    public static String[] readTables(String fileName) throws IOException
    {
	String result = "";
	File file = new File(fileName);
	FileReader fr = new FileReader(file);
	BufferedReader br = new BufferedReader(fr);
	String readLine = "";
	while ((readLine = br.readLine()) != null)
	{
	    result = result + "#" + readLine + "\n";
	}

	String[] tables = result.split("#");
	for (int i = 0; i < tables.length; i++)
	{
	    tables[i] = tables[i].trim();
	}
	br.close();
	fr.close();
	return tables;
    }

    public static String readFromTriggerFiles(File file) throws IOException
    {
	return readFile(file.getAbsolutePath());
    }

    static String readFile(String fn)
    {
	final int COUNT_PER_READ = 512;
	try
	{
	    File file = new File(fn);
	    final long filesize = file.length();
	    if (filesize > Integer.MAX_VALUE)
	    {
		System.err.println("God!   \nGates   can   do   it. ");
		return null;
	    }

	    BufferedReader in = new BufferedReader(new FileReader(file));

	    StringBuffer strbuf = new StringBuffer((int) filesize);
	    // char[] chrbuf = new char[(int)filesize];
	    char[] chrbuf = new char[COUNT_PER_READ];
	    int len;

	    while ((len = in.read(chrbuf, 0, COUNT_PER_READ)) == COUNT_PER_READ)
	    {
		// while ((len = in.read(chrbuf, 0, (int)filesize)) == filesize)
		// {
		strbuf.append(chrbuf);
	    }

	    if (len != -1)
	    {
		strbuf.append(chrbuf, 0, len);
	    }

	    return strbuf.toString();

	}
	catch (IOException ioe)
	{
	    ioe.printStackTrace();
	}

	return null;
    }

    public static List<String> selectTriggerFiles(String[] tables)
    {
	List<String> triggerFiles = new ArrayList<String>();
	String dirname = "src/com/ywl/test/sp";
	File dir = new File(dirname);
	File[] triggers = dir.listFiles();
	for (File file : triggers)
	{
	    String result;
	    try
	    {
		if (file.getName().toLowerCase().endsWith(".sp"))
		{
		    System.out.println("filename:" + file.getAbsolutePath() + ":" + file.getName());
		    result = readFromTriggerFiles(file);
		    for (String table : tables)
		    {
			if (table == null || table.isEmpty())
			    continue;

			Pattern pattern = Pattern.compile("[(\\s+)|.]" + table.toUpperCase() + "(\\s+)");
			Matcher matcher = pattern.matcher(result.toUpperCase());
			if (matcher.find())
			{
			    triggerFiles.add(file.getName());
			}
		    }
		}
		else
		{
		    continue;
		}
	    }
	    catch (IOException e)
	    {

	    }

	}
	return triggerFiles;
    }

    public static void main(String[] args) throws IOException
    {
	String[] tables = readTables("src/com/ywl/test/tables/tables.name");
	for (String str : tables)
	{
	    System.out.println(str);
	}
	List<String> triggers = selectTriggerFiles(tables);
	for (String str : triggers)
	{
	    System.out.println("---------->" + str);
	}
    }
}
