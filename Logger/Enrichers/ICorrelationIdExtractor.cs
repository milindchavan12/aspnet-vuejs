namespace AspNet.VueJs.Sample.Web.Logger.Enricher
{
    public interface ICorrelationIdExtractor
    {
        string GetCorrelationId();
    }
}