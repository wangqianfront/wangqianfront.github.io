package com.statestr.cloud.util;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringUtil
{

    public static String doubleValueOf(double d)
    {
	String str = String.valueOf(d);
	String suffix = Double.toString(d).split("\\.")[1];

	if (suffix.equals("0"))
	{
	    return str.substring(0, str.indexOf("."));
	}
	else
	{
	    return Double.toString(d);
	}
    }

    public static String format(String format, Object args)
    {
	String str = args.toString();
	if (str.contains("%"))
	{
	    NumberFormat percent = NumberFormat.getPercentInstance();
	    try
	    {
		Number number = percent.parse(str);
		str = number.toString();
	    }
	    catch (ParseException e)
	    {
		e.printStackTrace();
	    }
	}
	else if (str.contains(","))
	{
	    str = str.replaceAll(",", "");
	}

	if (str.contains("."))
	{
	    String suffix = str.split("\\.")[1];
	    if (suffix.equals("0"))
	    {
		str = str.substring(0, str.indexOf("."));
		return str;
	    }
	    else
	    {
		DecimalFormat decimalFormat = new DecimalFormat(format);
		if (args instanceof String)
		{
		    return decimalFormat.format(Double.parseDouble(str));
		}
		else
		{
		    return decimalFormat.format(args);
		}
	    }
	}

	return str;
    }

    public static boolean isNumeric(String str)
    {
	if (null == str)
	    return false;
	Pattern pattern = Pattern.compile("[0-9]*");
	Matcher isNum = pattern.matcher(str);
	if (!isNum.matches())
	{
	    return false;
	}
	return true;
    }

    public static String format(String str, Object... values)
    {

	for (int i = 0; i < values.length; i++)
	{
	    String s = "{" + i + "}";
	    // if (values[i] instanceof String)
	    // values[i] = "\"" + values[i] + "\"";
	    str = str.replace(s, values[i].toString());
	}

	// System.out.println(str);
	return str;
    }

    /**
     * @param target
     * @return false: target is not null or empty true:target is null or empty
     * 
     */
    public static boolean isNullOrEmpty(String target)
    {

	if (null == target)
	    return true;
	target = target.trim();
	if (target.equals("") || target.length() == 0)
	    return true;

	return false;
    }

    public static String valueOf(Object o)
    {
	return o == null ? null : String.valueOf(o);
    }

    public static String removeSpace(String str)
    {
	if (str != null && !str.equals(""))
	{
	    str = str.replaceAll("\t", "");
	    str = str.replaceAll("\n", "");
	}
	return str;
    }

    public static String generateFileID()
    {
	SimpleDateFormat sdf = new SimpleDateFormat("MMddyyyyhhmmssHH");
	return sdf.format(new Date());
    }
}
