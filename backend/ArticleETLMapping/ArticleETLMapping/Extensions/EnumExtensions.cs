using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace ArticleETLMapping.Extensions
{
    public static class EnumExtension
    {
        public static string ToDescription<T>(this T enumValue) where T : struct
        {
            if (!typeof(T).IsEnum)
                return null;

            var description = enumValue.ToString();
            FieldInfo fieldInfo = enumValue.GetType().GetField(description ?? string.Empty);

            if (fieldInfo == null) return description;
            if (!(fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), true) is DescriptionAttribute[] attrs))
            {
                return description;
            }

            if (attrs.Length > 0)
            {
                description = attrs[0].Description;
            }

            return description;
        }
    }
}
