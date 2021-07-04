namespace AspNet.VueJs.Sample.Web.Extensions
{
    public static class HttpCurrentContext
    {
        private static Microsoft.AspNetCore.Http.IHttpContextAccessor _httpContextAccessor;

        public static void Configure(Microsoft.AspNetCore.Http.IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }


        public static Microsoft.AspNetCore.Http.HttpContext Current => _httpContextAccessor.HttpContext;

        public static string UserName
        {
            get
            {
                var user = Current.User.Identity.Name;
                if (!string.IsNullOrEmpty(user))
                {
                    return user.Split('\\')[1];
                }
                return System.Security.Principal.WindowsIdentity.GetCurrent().Name.Split('\\')[1];
            }
        }
    }
}