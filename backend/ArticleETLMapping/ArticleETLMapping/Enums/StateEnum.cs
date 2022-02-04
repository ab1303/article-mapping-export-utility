using System.ComponentModel;

namespace ArticleETLMapping.Models
{
    public enum StateEnum
    {
        [Description("New South Wales - Super Market")]
        NSW_SUPER = 1,

        [Description("New South Wales - Metro")]
        NSW_METRO = 2,

        [Description("Victoria - Super Market")]
        VIC_SUPER = 3,

        [Description("Victoria - Metro")]
        VIC_METRO = 4,

        [Description("Queensland - Super Market")]
        QLD_SUPER = 5,

        [Description("Queensland - Metro")]
        QLD_METRO = 6
    }
}

